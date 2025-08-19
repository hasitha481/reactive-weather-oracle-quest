import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 Starting MultiplayerSync and QuestManager deployment...");
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "STT");
    
    if (parseFloat(ethers.formatEther(balance)) < 0.005) {
        console.log("⚠️  Warning: Very low STT balance. Using ultra-low gas to conserve tokens.");
    }

    try {
        console.log("\n💡 Using ULTRA-LOW gas settings to conserve STT:");
        console.log("   Gas Price: 0.1 gwei (10x lower than normal)");
        console.log("   Gas Limits: Minimal (150K/200K vs 250K/300K)");
        console.log("   Estimated cost: ~0.003-0.005 STT total");

        // Load existing deployed addresses
        let deployedAddresses = {};
        if (fs.existsSync('./deployed-addresses.json')) {
            deployedAddresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
        }

        // Deploy QuestManager first
        console.log("\n🎮 Deploying QuestManager...");
        const QuestManager = await ethers.getContractFactory("QuestManager");
        
        // QuestManager constructor parameters (adjust if needed)
        const weatherOracleAddress = deployedAddresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871";
        const weatherTokenAddress = deployedAddresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830";
        
        const questManager = await QuestManager.deploy(
            weatherOracleAddress,
            weatherTokenAddress,
            {
                gasLimit: 150000, // Ultra-low gas limit to save STT
                gasPrice: ethers.parseUnits("0.1", "gwei") // Minimal gas price (0.1 gwei)
            }
        );
        
        await questManager.waitForDeployment();
        const questManagerAddress = await questManager.getAddress();
        console.log("✅ QuestManager deployed to:", questManagerAddress);
        
        // Deploy MultiplayerSync
        console.log("\n👥 Deploying MultiplayerSync...");
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        // MultiplayerSync constructor parameters
        const multiplayerSync = await MultiplayerSync.deploy(
            weatherOracleAddress,
            questManagerAddress,
            weatherTokenAddress,
            {
                gasLimit: 200000, // Ultra-low gas limit to save STT  
                gasPrice: ethers.parseUnits("0.1", "gwei") // Minimal gas price (0.1 gwei)
            }
        );
        
        await multiplayerSync.waitForDeployment();
        const multiplayerSyncAddress = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync deployed to:", multiplayerSyncAddress);

        // Update deployed addresses
        deployedAddresses.QuestManager = questManagerAddress;
        deployedAddresses.MultiplayerSync = multiplayerSyncAddress;
        
        // Save updated addresses
        fs.writeFileSync(
            './deployed-addresses.json', 
            JSON.stringify(deployedAddresses, null, 2)
        );
        
        console.log("\n🎉 All contracts deployed successfully!");
        console.log("📄 Addresses saved to deployed-addresses.json");
        
        // Display summary
        console.log("\n📋 DEPLOYMENT SUMMARY:");
        console.log("WeatherOracle:", deployedAddresses.WeatherOracle);
        console.log("WeatherToken:", deployedAddresses.WeatherToken);
        console.log("WeatherNFT:", deployedAddresses.WeatherNFT);
        console.log("QuestManager:", questManagerAddress);
        console.log("MultiplayerSync:", multiplayerSyncAddress);
        
        console.log("\n🎯 Next Steps:");
        console.log("1. Update frontend/src/contracts/contractConfig.js with new addresses");
        console.log("2. Test contract interactions");
        console.log("3. Implement real blockchain calls in React frontend");

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        
        // Check if it's a gas-related error
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Solution: Get more STT tokens from Somnia faucet");
            console.log("   Faucet URL: https://faucet.somnia.network");
        }
        
        if (error.message.includes("gas")) {
            console.log("\n💡 Gas-related error solutions:");
            console.log("   1. Try increasing gas limit slightly (add +50K)");
            console.log("   2. Remove gas price setting (let network auto-estimate)"); 
            console.log("   3. Get more STT from faucet if absolutely needed");
        }
        
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });