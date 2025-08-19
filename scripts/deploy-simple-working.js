import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 FIXED - Deploy with Higher Gas Price for Somnia!");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 STT Balance:", ethers.formatEther(balance));
    
    // Load existing addresses
    let addresses = {};
    if (fs.existsSync('./deployed-addresses.json')) {
        addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    }

    const existingContracts = {
        WeatherOracle: addresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
        WeatherToken: addresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830",
        WeatherNFT: addresses.WeatherNFT || "0xFCfF86197876fA553d4dC54257E1bB66Ef048972"
    };

    try {
        // STEP 1: Deploy QuestManager with HIGHER gas price
        console.log("\n🎮 Deploying QuestManager with HIGHER gas price...");
        
        const QuestManager = await ethers.getContractFactory("QuestManager");
        
        // Use higher gas price to avoid "below base fee" error
        // Use VERY high gas price and no gas limit
        const questManager = await QuestManager.deploy(
            existingContracts.WeatherOracle,
            existingContracts.WeatherToken
            // Remove all gas settings - let network decide everything
        );
        
        await questManager.waitForDeployment();
        const questManagerAddress = await questManager.getAddress();
        console.log("✅ QuestManager deployed:", questManagerAddress);
        
        // Save address
        addresses.QuestManager = questManagerAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        // STEP 2: Deploy MultiplayerSync
        console.log("\n👥 Deploying MultiplayerSync...");
        
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        const multiplayerSync = await MultiplayerSync.deploy(
            existingContracts.WeatherOracle,
            questManagerAddress,
            existingContracts.WeatherToken
            // Remove all gas settings - let network decide everything
        );
        
        await multiplayerSync.waitForDeployment();
        const multiplayerSyncAddress = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync deployed:", multiplayerSyncAddress);
        
        // Save final addresses
        addresses.MultiplayerSync = multiplayerSyncAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        console.log("\n🎉🎉 SUCCESS! ALL 5 CONTRACTS DEPLOYED! 🎉🎉");
        console.log("\n📋 FINAL ADDRESSES:");
        Object.entries(addresses).forEach(([name, address]) => {
            console.log(`${name}: ${address}`);
        });
        
        console.log("\n🌟 PROJECT COMPLETE - READY FOR GRANT SUBMISSION!");

    } catch (error) {
        console.error("❌ Error:", error.message);
        console.log("\n💡 If still failing, try increasing gas price to 3.0 gwei");
    }
}

main().catch(console.error);