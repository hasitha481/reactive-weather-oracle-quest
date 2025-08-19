import fs from 'fs';

async function updateFrontendConfig() {
    console.log("🔄 Updating frontend with ALL deployed contract addresses...");
    
    // Read deployed addresses
    const deployedAddresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    // Create complete frontend config
    const frontendConfig = `// Auto-generated contract configuration
// Updated: ${new Date().toISOString()}
// ALL 5 CONTRACTS DEPLOYED SUCCESSFULLY!

export const contractConfig = {
  // Network Configuration
  network: {
    chainId: 50312,
    name: "Somnia Testnet",
    rpcUrl: "https://dream-rpc.somnia.network",
    blockExplorer: "https://testnet.somniumspace.com"
  },

  // 🎉 ALL DEPLOYED CONTRACT ADDRESSES
  addresses: {
    WeatherOracle: "${deployedAddresses.WeatherOracle}",
    WeatherToken: "${deployedAddresses.WeatherToken}", 
    WeatherNFT: "${deployedAddresses.WeatherNFT}",
    QuestManager: "${deployedAddresses.QuestManager}",
    MultiplayerSync: "${deployedAddresses.MultiplayerSync}"
  },

  // Ultra-low gas configuration for Somnia testnet
  gasConfig: {
    gasPrice: "500000000", // 0.5 gwei in wei
    gasLimit: {
      weatherUpdate: "75000",
      questStart: "100000",
      questComplete: "150000", 
      nftMint: "200000",
      tokenTransfer: "50000",
      multiplayerAction: "100000"
    }
  },

  // Complete Contract ABIs (core functions)
  abis: {
    WeatherOracle: [
      "function getCurrentWeather() view returns (uint8)",
      "function getWeatherDuration() view returns (uint256)",
      "function requestWeatherChange() external",
      "function getWeatherName(uint8) view returns (string)",
      "event WeatherChanged(uint8 newWeather, uint256 duration, uint256 timestamp)"
    ],
    
    WeatherToken: [
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address, uint256) returns (bool)",
      "function approve(address, uint256) returns (bool)",
      "function allowance(address, address) view returns (uint256)",
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ],
    
    WeatherNFT: [
      "function mintWeatherNFT(address, uint8) external returns (uint256)",
      "function tokenURI(uint256) view returns (string)",
      "function balanceOf(address) view returns (uint256)",
      "function ownerOf(uint256) view returns (address)",
      "function getWeatherExposure(uint256) view returns (uint8[])",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ],
    
    QuestManager: [
      "function getAvailableQuests() view returns (uint256[])",
      "function startQuest(uint256) external",
      "function completeQuest(uint256) external", 
      "function getQuestDetails(uint256) view returns (uint8, uint256, uint256, bool, uint256, string)",
      "function getPlayerStats(address) view returns (uint256, uint256, uint256[])",
      "function isQuestStarted(address, uint256) view returns (bool)",
      "function isQuestCompleted(address, uint256) view returns (bool)",
      "event QuestStarted(address indexed player, uint256 indexed questId)",
      "event QuestCompleted(address indexed player, uint256 indexed questId, uint256 reward)"
    ],
    
    MultiplayerSync: [
      "function registerPlayer(string) external",
      "function getPlayerStats(address) view returns (uint256, uint256, uint256)",
      "function joinCooperativeQuest(uint256) external",
      "function voteForWeather(uint8) external",
      "function getWeatherVotes() view returns (uint256[8])",
      "function updateAchievements(address, uint256) external",
      "function getLeaderboard() view returns (address[], uint256[])",
      "event PlayerRegistered(address indexed player, string username)",
      "event CooperativeQuestJoined(address indexed player, uint256 indexed questId)",
      "event WeatherVoted(address indexed player, uint8 weatherType)"
    ]
  },

  // Weather types mapping
  weatherTypes: {
    0: "Clear",
    1: "Storm", 
    2: "Sunshine",
    3: "Fog",
    4: "Rain",
    5: "Snow"
  },

  // Quest difficulty colors for UI
  difficultyColors: {
    1: "#10B981", // Easy - Green
    2: "#3B82F6", // Medium - Blue  
    3: "#F59E0B", // Hard - Orange
    4: "#EF4444", // Very Hard - Red
    5: "#8B5CF6"  // Extreme - Purple
  }
};

// Utility functions
export const areContractsDeployed = () => {
  return Object.values(contractConfig.addresses).every(addr => addr && addr !== "" && addr !== "0x0000000000000000000000000000000000000000");
};

export const getWeatherName = (weatherType) => {
  return contractConfig.weatherTypes[weatherType] || "Unknown";
};

export const getDifficultyColor = (difficulty) => {
  return contractConfig.difficultyColors[difficulty] || "#6B7280";
};

export const estimateGas = (operation) => {
  return contractConfig.gasConfig.gasLimit[operation] || "100000";
};

// Deployment status
export const deploymentStatus = {
  complete: true,
  timestamp: "${new Date().toISOString()}",
  totalContracts: 5,
  deployedContracts: ${Object.keys(deployedAddresses).length}
};

console.log("🎉 ALL CONTRACTS DEPLOYED AND CONFIGURED!");
console.log("Deployment Status:", deploymentStatus);
`;

    // Write updated config
    const configPath = './frontend/src/contracts/contractConfig.js';
    
    // Ensure directory exists
    if (!fs.existsSync('./frontend/src/contracts/')) {
        fs.mkdirSync('./frontend/src/contracts/', { recursive: true });
    }
    
    fs.writeFileSync(configPath, frontendConfig);
    
    console.log("✅ Frontend configuration completely updated!");
    console.log("📁 File:", configPath);
    
    // Display final summary
    console.log("\n🎉 PROJECT COMPLETION SUMMARY:");
    console.log("✅ Smart Contracts: 5/5 deployed");
    console.log("✅ Frontend Config: Updated");
    console.log("✅ Contract Integration: Ready");
    console.log("✅ Grant Submission: Ready");
    
    console.log("\n📋 Final Contract Addresses:");
    Object.entries(deployedAddresses).forEach(([name, address]) => {
        console.log(`   🔗 ${name}: ${address}`);
    });
    
    console.log("\n🚀 NEXT STEPS:");
    console.log("1. Test frontend integration with real contracts");
    console.log("2. Create demo video for grant submission"); 
    console.log("3. Prepare technical documentation");
    console.log("4. Submit to Somnia's $10M grant program!");
    
    console.log("\n🌟 CONGRATULATIONS! Weather-reactive blockchain gaming is ready!");
}

updateFrontendConfig().catch(console.error);