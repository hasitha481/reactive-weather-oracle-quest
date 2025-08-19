import hre from 'hardhat';
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🚀 Starting deployment to Somnia Network...");
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", await deployer.getAddress());
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    const deployedAddresses = {};

    try {
        // 1. Deploy WeatherOracle first (core dependency)
        console.log("\n1️⃣ Deploying WeatherOracle...");
        const WeatherOracle = await ethers.getContractFactory("WeatherOracle");
        const weatherOracle = await WeatherOracle.deploy();
        await weatherOracle.waitForDeployment();
        const weatherOracleAddress = await weatherOracle.getAddress();
        console.log("✅ WeatherOracle deployed to:", weatherOracleAddress);
        deployedAddresses.WeatherOracle = weatherOracleAddress;

        // 2. Deploy WeatherToken 
        console.log("\n2️⃣ Deploying WeatherToken...");
        const WeatherToken = await ethers.getContractFactory("WeatherToken");
        const weatherToken = await WeatherToken.deploy();
        await weatherToken.waitForDeployment();
        const weatherTokenAddress = await weatherToken.getAddress();
        console.log("✅ WeatherToken deployed to:", weatherTokenAddress);
        deployedAddresses.WeatherToken = weatherTokenAddress;

        // 3. Deploy WeatherNFT with WeatherOracle address
        console.log("\n3️⃣ Deploying WeatherNFT...");
        const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
        const weatherNFT = await WeatherNFT.deploy(weatherOracleAddress);
        await weatherNFT.waitForDeployment();
        const weatherNFTAddress = await weatherNFT.getAddress();
        console.log("✅ WeatherNFT deployed to:", weatherNFTAddress);
        deployedAddresses.WeatherNFT = weatherNFTAddress;

        // 4. Deploy QuestManager with dependencies
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

        // 5. Configure contract permissions
        console.log("\n🔧 Configuring contract permissions...");
        
        // Grant QuestManager permission to mint tokens
        const minterRole = await weatherToken.MINTER_ROLE();
        await weatherToken.grantRole(minterRole, questManagerAddress);
        console.log("✅ QuestManager granted MINTER_ROLE for WeatherToken");
        
        // Grant QuestManager permission to update NFT weather exposure
        const weatherUpdaterRole = await weatherNFT.WEATHER_UPDATER_ROLE();
        await weatherNFT.grantRole(weatherUpdaterRole, questManagerAddress);
        console.log("✅ QuestManager granted WEATHER_UPDATER_ROLE for WeatherNFT");

        // 6. Initialize some test weather conditions
        console.log("\n🌤️ Setting initial weather conditions...");
        await weatherOracle.setWeather(0, 1); // Zone 0: Sunny
        await weatherOracle.setWeather(1, 2); // Zone 1: Rainy  
        await weatherOracle.setWeather(2, 0); // Zone 2: Clear
        console.log("✅ Initial weather conditions set");

        // 7. Save deployment addresses
        const addressesPath = path.join(__dirname, "../deployed-addresses.json");
        fs.writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));
        console.log("✅ Contract addresses saved to deployed-addresses.json");

        // 8. Generate frontend config
        const frontendConfig = {
            network: "somniaTestnet",
            chainId: 50312,
            contracts: deployedAddresses,
            deploymentTime: new Date().toISOString(),
            deployer: await deployer.getAddress()
        };
        
        const configPath = path.join(__dirname, "../frontend/src/config/contracts.json");
        const configDir = path.dirname(configPath);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        fs.writeFileSync(configPath, JSON.stringify(frontendConfig, null, 2));
        console.log("✅ Frontend config generated");

        // 9. Update frontend contract config with real addresses
        const contractConfigPath = path.join(__dirname, "../frontend/src/contracts/contractConfig.js");
        const contractConfigContent = `// Auto-generated contract configuration
// Updated: ${new Date().toISOString()}

export const SOMNIA_TESTNET = {
  chainId: 50312,
  name: 'Somnia Testnet',
  rpcUrl: 'https://jsonrpc-testnet.somnia.network',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  blockExplorer: 'https://explorer-testnet.somnia.network'
};

export const deployedAddresses = {
  WeatherOracle: "${deployedAddresses.WeatherOracle}",
  WeatherToken: "${deployedAddresses.WeatherToken}",
  WeatherNFT: "${deployedAddresses.WeatherNFT}",
  QuestManager: "${deployedAddresses.QuestManager}"
};

export const CONTRACT_ADDRESSES = deployedAddresses;

// Contract ABIs (simplified for demo)
export const WEATHER_ORACLE_ABI = [
  "function getWeather(uint256 zoneId) view returns (uint8)",
  "function setWeather(uint256 zoneId, uint8 weatherType)",
  "event WeatherChanged(uint256 indexed zoneId, uint8 newWeather, uint256 timestamp)"
];

export const QUEST_MANAGER_ABI = [
  "function startQuest(uint256 questId)",
  "function completeQuest(uint256 questId)",
  "function getActiveQuests(address player) view returns (uint256[])"
];

export const WEATHER_NFT_ABI = [
  "function mint(address to, uint256 category) payable returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
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
  isDeployed: true,
  lastUpdated: "${new Date().toISOString()}",
  network: 'somniaTestnet'
};`;

        fs.writeFileSync(contractConfigPath, contractConfigContent);
        console.log("✅ Frontend contract config updated with real addresses");

        console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📋 Contract Addresses:");
        Object.entries(deployedAddresses).forEach(([name, address]) => {
            console.log(`   ${name}: ${address}`);
        });
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔗 Somnia Explorer: https://explorer-testnet.somnia.network");
        console.log("📱 Frontend ready for integration!");
        console.log("\n🚀 Next: Start your frontend with 'cd frontend && npm start'");

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });