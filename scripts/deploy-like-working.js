import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployLikeWorkingContracts() {
    console.log("🚀 Deploy using SAME pattern as working contracts!");
    
    const [deployer] = await ethers.getSigners();
    console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    
    const addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    try {
        // Get current network gas price
        const feeData = await deployer.provider.getFeeData();
        const networkGasPrice = feeData.gasPrice;
        console.log("🌐 Network gas price:", ethers.formatUnits(networkGasPrice, "gwei"), "gwei");
        
        // Use network gas price + 50% buffer
        const gasPrice = networkGasPrice * BigInt(150) / BigInt(100);
        console.log("⛽ Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
        
        // Deploy QuestManager
        console.log("\n🎮 Deploying QuestManager...");
        const QuestManager = await ethers.getContractFactory("QuestManager");
        
        const questManager = await QuestManager.deploy(
            addresses.WeatherOracle,
            addresses.WeatherToken,
            { gasPrice }
        );
        
        const receipt = await questManager.waitForDeployment();
        const questManagerAddress = await questManager.getAddress();
        console.log("✅ QuestManager:", questManagerAddress);
        
        addresses.QuestManager = questManagerAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        // Deploy MultiplayerSync
        console.log("\n👥 Deploying MultiplayerSync...");
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.WeatherOracle,
            questManagerAddress,
            addresses.WeatherToken,
            { gasPrice }
        );
        
        await multiplayerSync.waitForDeployment();
        const multiplayerSyncAddress = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync:", multiplayerSyncAddress);
        
        addresses.MultiplayerSync = multiplayerSyncAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        console.log("\n🎉 SUCCESS! All contracts deployed!");
        console.log("📋 Final addresses:", addresses);
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Full error:", error);
    }
}

deployLikeWorkingContracts().catch(console.error);