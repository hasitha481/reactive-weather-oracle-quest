import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 ULTRA-MINIMAL deployment - conserving every drop of STT!");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 STT Balance:", ethers.formatEther(balance));
    
    // Load addresses
    const addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    try {
        console.log("\n🎮 Deploying QuestManager with MINIMAL gas...");
        const QuestManager = await ethers.getContractFactory("QuestManager");
        
        // Deploy with NO gas settings (let network decide - often cheaper)
        const questManager = await QuestManager.deploy(
            addresses.WeatherOracle,
            addresses.WeatherToken
        );
        
        await questManager.waitForDeployment();
        const questAddress = await questManager.getAddress();
        console.log("✅ QuestManager:", questAddress);
        
        console.log("\n👥 Deploying MultiplayerSync with MINIMAL gas...");
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.WeatherOracle,
            questAddress,
            addresses.WeatherToken
        );
        
        await multiplayerSync.waitForDeployment();
        const multiAddress = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync:", multiAddress);

        // Update addresses
        addresses.QuestManager = questAddress;
        addresses.MultiplayerSync = multiAddress;
        
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        console.log("\n🎉 SUCCESS! Both contracts deployed with minimal STT usage!");

    } catch (error) {
        console.error("❌ Error:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n🆘 CRITICAL: Need more STT from faucet!");
            console.log("   Visit: https://faucet.somnia.network");
        }
    }
}

main().catch(console.error);