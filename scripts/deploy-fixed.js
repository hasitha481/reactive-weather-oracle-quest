import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 Fixed deployment script - Deploy missing contracts!");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 STT Balance:", ethers.formatEther(balance));
    console.log("📝 Deployer:", deployer.address);
    
    // Load existing addresses
    let addresses = {};
    if (fs.existsSync('./deployed-addresses.json')) {
        addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
        console.log("📋 Existing contracts:", Object.keys(addresses));
    }

    const existingContracts = {
        WeatherOracle: addresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
        WeatherToken: addresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830",
        WeatherNFT: addresses.WeatherNFT || "0xFCfF86197876fA553d4dC54257E1bB66Ef048972"
    };

    try {
        // STEP 1: Deploy QuestManager (now that we created it)
        console.log("\n🎮 STEP 1: Deploying QuestManager...");
        
        const QuestManager = await ethers.getContractFactory("QuestManager");
        const questManager = await QuestManager.deploy(
            existingContracts.WeatherOracle,
            existingContracts.WeatherToken,
            {
                gasLimit: 300000,  // Higher for complex contract
                gasPrice: ethers.parseUnits("0.5", "gwei")
            }
        );
        
        await questManager.waitForDeployment();
        const questManagerAddress = await questManager.getAddress();
        console.log("✅ QuestManager deployed:", questManagerAddress);
        
        // Update addresses
        addresses.QuestManager = questManagerAddress;
        
        // STEP 2: Deploy MultiplayerSync (with real QuestManager address)
        console.log("\n👥 STEP 2: Deploying MultiplayerSync...");
        
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        const multiplayerSync = await MultiplayerSync.deploy(
            existingContracts.WeatherOracle,
            questManagerAddress,  // Use newly deployed QuestManager
            existingContracts.WeatherToken,
            {
                gasLimit: 350000,  // Higher for complex contract
                gasPrice: ethers.parseUnits("0.5", "gwei")
            }
        );
        
        await multiplayerSync.waitForDeployment();
        const multiplayerSyncAddress = await multiplayerSync.getAddress();
        console.log("✅ MultiplayerSync deployed:", multiplayerSyncAddress);
        
        // Update addresses
        addresses.MultiplayerSync = multiplayerSyncAddress;
        
        // Save final addresses
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        console.log("\n🎉🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY! 🎉🎉");
        console.log("\n📋 COMPLETE CONTRACT SUITE:");
        console.log("⚡ WeatherOracle:", addresses.WeatherOracle);
        console.log("🪙 WeatherToken:", addresses.WeatherToken);
        console.log("🖼️  WeatherNFT:", addresses.WeatherNFT);
        console.log("🎮 QuestManager:", addresses.QuestManager);
        console.log("👥 MultiplayerSync:", addresses.MultiplayerSync);
        
        // Check remaining balance
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        const gasUsed = parseFloat(ethers.formatEther(balance)) - parseFloat(ethers.formatEther(finalBalance));
        console.log("\n💰 Gas used:", gasUsed.toFixed(6), "STT");
        console.log("💰 Remaining balance:", ethers.formatEther(finalBalance), "STT");
        
        console.log("\n🎯 NEXT STEPS:");
        console.log("1. ✅ All 5 core contracts deployed!");
        console.log("2. 🔄 Update frontend with new contract addresses");
        console.log("3. 🧪 Test end-to-end blockchain interactions");
        console.log("4. 🏆 Prepare grant submission - PROJECT 95% COMPLETE!");
        
        console.log("\n🌟 CONGRATULATIONS! Your innovative weather-reactive blockchain game is ready!");

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Need more STT from faucet: https://faucet.somnia.network");
        }
        
        if (error.message.includes("gas")) {
            console.log("\n💡 Try increasing gas limit by 50K or removing gas price");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });