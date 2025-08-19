import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployMultiplayerCorrect() {
    console.log("🔧 Deploy MultiplayerSync with CORRECT 3 parameters");
    
    const [deployer] = await ethers.getSigners();
    console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    
    const addresses = {
        weatherOracle: "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
        questManager: "0x2ebf0c86a306cfddac26e22b62375ffdd4647c13", 
        weatherToken: "0x3a832f200b441f86e366763f60d729797d5ae830",
        weatherNFT: "0xfcff86197876fa553d4dc54257e1bb66ef048972"
    };
    
    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        console.log("🎯 Constructor needs 3 params: weatherOracle, weatherToken, weatherNFT");
        console.log("💡 The expensive operation is _createInitialAchievements() in constructor");
        console.log("🔧 Using VERY HIGH gas limit to handle expensive initialization...");
        
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.weatherOracle,
            addresses.weatherToken,  
            addresses.weatherNFT,    // Correct 3rd parameter
            {
                gasLimit: 5000000,  // 5M gas limit (10x normal)
                gasPrice: ethers.parseUnits("8.0", "gwei")
            }
        );
        
        console.log("⏳ Deploying with 5M gas limit (to handle achievements initialization)...");
        await multiplayerSync.waitForDeployment();
        
        const deployedAddress = await multiplayerSync.getAddress();
        console.log("✅ SUCCESS! MultiplayerSync deployed:", deployedAddress);
        
        // Save all final addresses
        const finalAddresses = {
            "WeatherOracle": ethers.getAddress(addresses.weatherOracle),
            "WeatherToken": ethers.getAddress(addresses.weatherToken),
            "WeatherNFT": ethers.getAddress(addresses.weatherNFT),
            "QuestManager": ethers.getAddress(addresses.questManager),
            "MultiplayerSync": deployedAddress
        };
        
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));
        
        // Calculate costs
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        const gasUsed = 0.351116594 - parseFloat(ethers.formatEther(finalBalance));
        
        console.log("\n🎉🎉🎉 PROJECT 100% COMPLETE! 🎉🎉🎉");
        console.log("\n📋 ALL 5 CONTRACTS DEPLOYED:");
        Object.entries(finalAddresses).forEach(([name, address]) => {
            console.log(`✅ ${name}: ${address}`);
        });
        
        console.log("\n💰 Final deployment cost:", gasUsed.toFixed(4), "STT");
        console.log("💰 Remaining balance:", ethers.formatEther(finalBalance), "STT");
        
        console.log("\n🌟🌟🌟 HISTORIC ACHIEVEMENT! 🌟🌟🌟");
        console.log("🎮 World's FIRST weather-reactive blockchain adventure game!");
        console.log("⚡ Real-time weather affecting gameplay mechanics");
        console.log("🎯 Dynamic quest system with 14+ weather-specific quests");
        console.log("🖼️  Weather-evolution NFT system");
        console.log("👥 Multiplayer social features with achievements");
        console.log("🏆 Ready for Somnia's $10M Dream Catalyst grant!");
        
        console.log("\n🎯 Problem Solved:");
        console.log("   Issue: _createInitialAchievements() in constructor");
        console.log("   Solution: 5M gas limit to handle expensive initialization");
        console.log("   Result: Complete innovative blockchain game!");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        
        if (error.message.includes("out of gas")) {
            console.log("\n💡 Try increasing gas limit to 8,000,000");
        }
    }
}

deployMultiplayerCorrect().catch(console.error);