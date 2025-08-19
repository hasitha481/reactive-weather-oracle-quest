import hre from 'hardhat';
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🚀 Efficient deployment to Somnia Network...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", await deployer.getAddress());
    
    let balance = await ethers.provider.getBalance(deployer.address);
    console.log("Starting balance:", ethers.formatEther(balance), "STT");

    const deployedAddresses = {};

    try {
        // 1. Use existing WeatherOracle (already deployed)
        const weatherOracleAddress = "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871";
        console.log("\n1️⃣ Using existing WeatherOracle:", weatherOracleAddress);
        deployedAddresses.WeatherOracle = weatherOracleAddress;

        // Check balance after each deployment
        balance = await ethers.provider.getBalance(deployer.address);
        console.log("Balance after WeatherOracle:", ethers.formatEther(balance), "STT");

        // 2. Deploy WeatherToken (most gas-efficient)
        console.log("\n2️⃣ Deploying WeatherToken...");
        const WeatherToken = await ethers.getContractFactory("WeatherToken");
        const weatherToken = await WeatherToken.deploy();
        await weatherToken.waitForDeployment();
        const weatherTokenAddress = await weatherToken.getAddress();
        console.log("✅ WeatherToken deployed to:", weatherTokenAddress);
        deployedAddresses.WeatherToken = weatherTokenAddress;

        balance = await ethers.provider.getBalance(deployer.address);
        console.log("Balance after WeatherToken:", ethers.formatEther(balance), "STT");

        // Check if we have enough balance to continue
        if (parseFloat(ethers.formatEther(balance)) < 0.05) {
            console.log("⚠️ Low balance detected. Stopping deployment.");
            console.log("💡 You can continue tomorrow with fresh 0.5 STT or get more tokens.");
            return;
        }

        // 3. Deploy WeatherNFT
        console.log("\n3️⃣ Deploying WeatherNFT...");
        const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
        const weatherNFT = await WeatherNFT.deploy(weatherOracleAddress);
        await weatherNFT.waitForDeployment();
        const weatherNFTAddress = await weatherNFT.getAddress();
        console.log("✅ WeatherNFT deployed to:", weatherNFTAddress);
        deployedAddresses.WeatherNFT = weatherNFTAddress;

        balance = await ethers.provider.getBalance(deployer.address);
        console.log("Balance after WeatherNFT:", ethers.formatEther(balance), "STT");

        // Check balance again
        if (parseFloat(ethers.formatEther(balance)) < 0.03) {
            console.log("⚠️ Insufficient balance for QuestManager. Saving progress...");
            await saveProgress(deployedAddresses);
            return;
        }

        // 4. Deploy QuestManager
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

        // Save all addresses and update frontend
        await saveProgress(deployedAddresses);

        // Quick contract setup (minimal gas)
        console.log("\n🔧 Basic contract configuration...");
        
        try {
            // Only grant essential permissions
            const minterRole = await weatherToken.MINTER_ROLE();
            await weatherToken.grantRole(minterRole, questManagerAddress);
            console.log("✅ QuestManager granted MINTER_ROLE");
        } catch (error) {
            console.log("⚠️ Permission setup failed (low gas). Can be done later.");
        }

        console.log("\n🎉 DEPLOYMENT COMPLETE!");
        console.log("📋 All contracts deployed successfully!");
        console.log("💰 Gas used efficiently - contracts ready for testing!");

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        if (Object.keys(deployedAddresses).length > 0) {
            console.log("💾 Saving partial progress...");
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

// Simplified ABIs for gas efficiency
export const WEATHER_ORACLE_ABI = [
  "function getWeather(uint256 zoneId) view returns (uint8)",
  "function setWeather(uint256 zoneId, uint8 weatherType)",
  "event WeatherChanged(uint256 indexed zoneId, uint8 newWeather, uint256 timestamp)"
];

export const QUEST_MANAGER_ABI = [
  "function startQuest(uint256 questId)",
  "function completeQuest(uint256 questId)"
];

export const WEATHER_NFT_ABI = [
  "function mint(address to, uint256 category) payable returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

export const WEATHER_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export const WEATHER_TYPES = {
  0: 'Clear', 1: 'Sunny', 2: 'Rainy', 3: 'Stormy', 4: 'Foggy', 5: 'Snowy'
};

export const NFT_CATEGORIES = {
  0: 'Storm Gear', 1: 'Weather Collectible', 2: 'Ancient Artifact', 3: 'Elemental Weapon', 4: 'Weather Tool'
};

export const DEPLOYMENT_STATUS = {
  isDeployed: ${Object.keys(deployedAddresses).length === 4},
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