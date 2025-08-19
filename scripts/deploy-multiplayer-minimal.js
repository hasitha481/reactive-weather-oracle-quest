import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployMultiplayerMinimal() {
    console.log("👥 Deploying MultiplayerSync with MINIMAL gas...");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "STT");
    
    const addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        // Use minimal gas settings
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.WeatherOracle,
            addresses.QuestManager,
            addresses.WeatherToken,
            {
                gasLimit: 400000,  // Lower gas limit
                gasPrice: ethers.parseUnits("6.5", "gwei") // Minimal above base fee
            }
        );
        
        await multiplayerSync.waitForDeployment();
        const address = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync:", address);
        
        addresses.MultiplayerSync = address;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        console.log("\n🎉🎉 ALL 5 CONTRACTS DEPLOYED! PROJECT COMPLETE! 🎉🎉");
        console.log("\n📋 FINAL ADDRESSES:");
        Object.entries(addresses).forEach(([name, addr]) => {
            console.log(`${name}: ${addr}`);
        });
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

deployMultiplayerMinimal();