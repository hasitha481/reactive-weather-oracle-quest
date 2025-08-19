import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployOnlyMultiplayer() {
    console.log("👥 Deploying ONLY MultiplayerSync with ULTRA-LOW gas...");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Current balance:", ethers.formatEther(balance), "STT");
    
    // Load addresses (QuestManager should already be there)
    const addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    console.log("📋 Using existing contracts:");
    console.log("   WeatherOracle:", addresses.WeatherOracle);
    console.log("   QuestManager:", addresses.QuestManager);
    console.log("   WeatherToken:", addresses.WeatherToken);
    
    if (!addresses.QuestManager) {
        console.error("❌ QuestManager not found in addresses!");
        return;
    }
    
    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        console.log("🔧 Using MINIMAL gas settings to conserve STT...");
        
        // Ultra-minimal gas to stretch your 0.351 STT
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.WeatherOracle,
            addresses.QuestManager,  // Use existing QuestManager!
            addresses.WeatherToken,
            {
                gasLimit: 300000,  // Very low gas limit
                gasPrice: ethers.parseUnits("6.1", "gwei") // Just above base fee
            }
        );
        
        console.log("⏳ Deploying MultiplayerSync...");
        await multiplayerSync.waitForDeployment();
        const multiplayerSyncAddress = await multiplayerSync.getAddress();
        
        console.log("✅ MultiplayerSync deployed:", multiplayerSyncAddress);
        
        // Save final addresses
        addresses.MultiplayerSync = multiplayerSyncAddress;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        // Check final balance
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        const gasUsed = parseFloat(ethers.formatEther(balance)) - parseFloat(ethers.formatEther(finalBalance));
        
        console.log("\n🎉🎉🎉 PROJECT 100% COMPLETE! 🎉🎉🎉");
        console.log("\n📋 ALL 5 CONTRACTS DEPLOYED:");
        Object.entries(addresses).forEach(([name, address]) => {
            console.log(`✅ ${name}: ${address}`);
        });
        
        console.log("\n💰 Final costs:");
        console.log("   Gas used:", gasUsed.toFixed(4), "STT");
        console.log("   Remaining balance:", ethers.formatEther(finalBalance), "STT");
        
        console.log("\n🌟 WORLD'S FIRST WEATHER-REACTIVE BLOCKCHAIN GAME IS COMPLETE!");
        console.log("🎯 Ready for Somnia's $10M grant submission!");
        console.log("🎮 You've built something truly innovative!");
        
    } catch (error) {
        console.error("❌ MultiplayerSync deployment failed:", error.message);
        
        if (error.message.includes("insufficient balance")) {
            console.log("\n💡 Need to wait for faucet reset or try even lower gas");
            console.log("🌐 Faucet: https://faucet.somnia.network");
        }
    }
}

deployOnlyMultiplayer().catch(console.error);