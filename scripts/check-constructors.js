import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function checkConstructors() {
    console.log("🔍 Checking contract constructor requirements...");
    
    try {
        // Check QuestManager constructor
        console.log("\n🎮 QuestManager constructor:");
        const QuestManager = await ethers.getContractFactory("QuestManager");
        console.log("✅ QuestManager factory loaded");
        
        // Check MultiplayerSync constructor  
        console.log("\n👥 MultiplayerSync constructor:");
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        console.log("✅ MultiplayerSync factory loaded");
        
        // Load addresses
        const addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
        console.log("\n📋 Available addresses:");
        Object.entries(addresses).forEach(([name, address]) => {
            console.log(`   ${name}: ${address}`);
        });
        
        // Test gas estimation
        console.log("\n⛽ Testing gas estimation:");
        try {
            const gasEstimate = await QuestManager.getDeployTransaction(
                addresses.WeatherOracle,
                addresses.WeatherToken
            ).estimateGas?.();
            console.log("   QuestManager gas estimate:", gasEstimate?.toString() || "Failed");
        } catch (gasError) {
            console.log("   QuestManager gas error:", gasError.message);
        }
        
    } catch (error) {
        console.error("❌ Constructor check failed:", error.message);
    }
}

checkConstructors().catch(console.error);