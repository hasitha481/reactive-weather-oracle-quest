import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 Final deployment with CORRECT gas price for Somnia!");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 STT Balance:", ethers.formatEther(balance));
    
    // Load existing addresses
    let addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    // Use HIGHER gas price (Somnia needs 6+ gwei)
    const gasSettings = {
        gasLimit: 800000,  // High gas limit
        gasPrice: ethers.parseUnits("8.0", "gwei") // 8 gwei (higher than 6 gwei base)
    };
    
    console.log("⛽ Using gas price: 8.0 gwei (above Somnia's 6.0 gwei base fee)");

    try {
        // Deploy QuestManager
        console.log("\n🎮 Deploying QuestManager...");
        const QuestManager = await ethers.getContractFactory("QuestManager");
        
        const questManager = await QuestManager.deploy(
            addresses.WeatherOracle,
            addresses.WeatherToken,
            gasSettings
        );
        
        await questManager.waitForDeployment();
        const questManagerAddress = await questManager.getAddress();
        console.log("✅ QuestManager deployed:", questManagerAddress);
        
        // Save address
        addresses.QuestManager = questManagerAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        // Deploy MultiplayerSync
        console.log("\n👥 Deploying MultiplayerSync...");
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.WeatherOracle,
            questManagerAddress,
            addresses.WeatherToken,
            gasSettings
        );
        
        await multiplayerSync.waitForDeployment();
        const multiplayerSyncAddress = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync deployed:", multiplayerSyncAddress);
        
        // Save final addresses
        addresses.MultiplayerSync = multiplayerSyncAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        console.log("\n🎉🎉 SUCCESS! ALL 5 CONTRACTS DEPLOYED! 🎉🎉");
        console.log("\n📋 ALL CONTRACT ADDRESSES:");
        Object.entries(addresses).forEach(([name, address]) => {
            console.log(`${name}: ${address}`);
        });
        
        // Calculate gas used
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        const gasUsed = parseFloat(ethers.formatEther(balance)) - parseFloat(ethers.formatEther(finalBalance));
        console.log("\n💰 Total gas used:", gasUsed.toFixed(4), "STT");
        console.log("💰 Remaining balance:", ethers.formatEther(finalBalance), "STT");
        
        console.log("\n🌟 WEATHER-REACTIVE BLOCKCHAIN GAME COMPLETE!");
        console.log("🎯 READY FOR SOMNIA GRANT SUBMISSION!");

    } catch (error) {
        console.error("❌ Still failed:", error.message);
        console.log("\n🔧 If this fails, try manually increasing gas to 10 gwei");
    }
}

main().catch(console.error);