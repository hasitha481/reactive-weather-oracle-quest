import hre from 'hardhat';
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🚀 Correct deployment with proper constructor...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", await deployer.getAddress());
    
    let balance = await ethers.provider.getBalance(deployer.address);
    console.log("Starting balance:", ethers.formatEther(balance), "STT");

    const deployedAddresses = {};

    try {
        // 1. Use existing contracts
        const weatherOracleAddress = "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871";
        const weatherTokenAddress = "0x3A832f200b441f86E366763F60d729797D5ae830";
        
        console.log("\n1️⃣ Using existing WeatherOracle:", weatherOracleAddress);
        console.log("2️⃣ Using existing WeatherToken:", weatherTokenAddress);
        
        deployedAddresses.WeatherOracle = weatherOracleAddress;
        deployedAddresses.WeatherToken = weatherTokenAddress;

        // 3. Deploy WeatherNFT with CORRECT constructor parameters
        console.log("\n3️⃣ Deploying WeatherNFT with correct parameters...");
        
        // Get network fee data for minimal gas
        const feeData = await ethers.provider.getFeeData();
        
        const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
        const weatherNFT = await WeatherNFT.deploy(
            "Weather Quest NFT",           // name: string
            "WQNFT",                      // symbol: string  
            await deployer.getAddress()    // _treasury: address (use deployer as treasury)
        );
        
        await weatherNFT.waitForDeployment();
        const weatherNFTAddress = await weatherNFT.getAddress();
        console.log("✅ WeatherNFT deployed to:", weatherNFTAddress);
        deployedAddresses.WeatherNFT = weatherNFTAddress;

        balance = await ethers.provider.getBalance(deployer.address);
        console.log("Balance after WeatherNFT:", ethers.formatEther(balance), "STT");

        // 4. Deploy QuestManager if we have enough balance
        if (parseFloat(ethers.formatEther(balance)) > 0.05) {
            console.log("\n4️⃣ Deploying QuestManager...");
            
            const QuestManager = await ethers.getContractFactory("QuestManager");
            const questManager = await QuestManager.deploy(
                weatherOracleAddress,
                weatherTokenAddress,
                weatherNFTAddress
            );
            
            await questManager.waitForDeployment();
            const questManagerAddress = await questManager.getAddress();
            console.log("✅ QuestManager deployed to:", questManagerAddress);
            deployedAddresses.QuestManager = questManagerAddress;

            balance = await ethers.provider.getBalance(deployer.address);
            console.log("Final balance:", ethers.formatEther(balance), "STT");
        } else {
            console.log("⚠️ Insufficient balance for QuestManager. Can deploy later.");
        }

        // Save progress
        await saveProgress(deployedAddresses);

        console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
        console.log("📋 Contract Addresses:");
        Object.entries(deployedAddresses).forEach(([name, address]) => {
            console.log(`   ${name}: ${address}`);
        });
        
        console.log("\n🔗 View on Somnia Explorer:");
        console.log("   https://shannon-explorer.somnia.network");

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        if (Object.keys(deployedAddresses).length > 0) {
            await saveProgress(deployedAddresses);
        }
    }
}

async function saveProgress(deployedAddresses) {
    try {
        // Save deployment addresses
        const addressesPath = path.join(__dirname, "../deployed-addresses.json");
        fs.writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));
        console.log("✅ Addresses saved to deployed-addresses.json");

        // Update frontend contract config
        const contractConfigPath = path.join(__dirname, "../frontend/src/contracts/contractConfig.js");
        const contractConfigContent = `// Auto-generated contract configuration
// Updated: ${new Date().toISOString()}

export const SOMNIA_TESTNET = {
  chainId: 50312,
  name: 'Somnia Testnet',
  rpcUrl: 'https://dream-rpc.somnia.network',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  blockExplorer: 'https://shannon-explorer.somnia.network'
};

export const deployedAddresses = {
  WeatherOracle: "${deployedAddresses.WeatherOracle || '0x0000000000000000000000000000000000000000'}",
  WeatherToken: "${deployedAddresses.WeatherToken || '0x0000000000000000000000000000000000000000'}",
  WeatherNFT: "${deployedAddresses.WeatherNFT || '0x0000000000000000000000000000000000000000'}",
  QuestManager: "${deployedAddresses.QuestManager || '0x0000000000000000000000000000000000000000'}"
};

export const CONTRACT_ADDRESSES = deployedAddresses;

// Contract ABIs
export const WEATHER_ORACLE_ABI = [
  "function getWeather(uint256 zoneId) view returns (uint8)",
  "function setWeather(uint256 zoneId, uint8 weatherType)"
];

export const QUEST_MANAGER_ABI = [
  "function startQuest(uint256 questId)",
  "function completeQuest(uint256 questId)"
];

export const WEATHER_NFT_ABI = [
  "function mint(address to, uint256 category) payable returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

export const WEATHER_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

export const WEATHER_TYPES = {
  0: 'Clear', 1: 'Sunny', 2: 'Rainy', 3: 'Stormy', 4: 'Foggy', 5: 'Snowy'
};

export const NFT_CATEGORIES = {
  0: 'Storm Gear', 1: 'Weather Collectible', 2: 'Ancient Artifact', 3: 'Elemental Weapon', 4: 'Weather Tool'
};

export const DEPLOYMENT_STATUS = {
  isDeployed: ${Object.keys(deployedAddresses).length >= 3},
  lastUpdated: "${new Date().toISOString()}",
  network: 'somniaTestnet'
};`;

        fs.writeFileSync(contractConfigPath, contractConfigContent);
        console.log("✅ Frontend config updated");

    } catch (error) {
        console.error("Error saving progress:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });