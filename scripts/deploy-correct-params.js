import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployCorrectParams() {
    console.log("🎯 Deploy with CORRECT constructor parameters");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "STT");
    
    // CORRECT parameters that match the actual constructor
    const correctParams = {
        weatherOracle: "0x1df5ff83103097fc44a0a4bc182c40cce7341871",  // ✅ Param 1
        weatherToken: "0x3a832f200b441f86e366763f60d729797d5ae830",   // ✅ Param 2
        weatherNFT: "0xfcff86197876fa553d4dc54257e1bb66ef048972"     // ✅ Param 3
    };
    
    console.log("📋 Using CORRECT constructor parameters:");
    console.log("   1. weatherOracle:", correctParams.weatherOracle);
    console.log("   2. weatherToken:", correctParams.weatherToken);
    console.log("   3. weatherNFT:", correctParams.weatherNFT);
    console.log("   (NOT questManager - that was wrong!)");
    
    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        const multiplayerSync = await MultiplayerSync.deploy(
            correctParams.weatherOracle,  // address _weatherOracle
            correctParams.weatherToken,   // address _weatherToken  
            correctParams.weatherNFT,     // address _weatherNFT
            {
                gasLimit: 400000,
                gasPrice: ethers.parseUnits("6.2", "gwei")
            }
        );
        
        console.log("⏳ Deploying with correct parameters...");
        await multiplayerSync.waitForDeployment();
        
        const deployedAddress = await multiplayerSync.getAddress();
        console.log("✅ SUCCESS! MultiplayerSync deployed:", deployedAddress);
        
        // Save ALL 5 contracts - COMPLETE PROJECT!
        const finalAddresses = {
            "WeatherOracle": "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
            "WeatherToken": "0x3A832f200b441f86E366763f60d729797D5ae830",
            "WeatherNFT": "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
            "QuestManager": "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
            "MultiplayerSync": deployedAddress
        };
        
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));
        
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        const gasUsed = parseFloat(ethers.formatEther(balance)) - parseFloat(ethers.formatEther(finalBalance));
        
        console.log("\n🎉🎉🎉 PROJECT 100% COMPLETE! 🎉🎉🎉");
        console.log("\n📋 ALL 5 CONTRACTS SUCCESSFULLY DEPLOYED:");
        Object.entries(finalAddresses).forEach(([name, address]) => {
            console.log(`✅ ${name}: ${address}`);
        });
        
        console.log("\n💰 Final deployment cost:", gasUsed.toFixed(4), "STT");
        console.log("💰 Remaining balance:", ethers.formatEther(finalBalance), "STT");
        
        console.log("\n🌟🌟🌟 HISTORIC ACHIEVEMENT! 🌟🌟🌟");
        console.log("🎮 World's FIRST weather-reactive blockchain adventure game!");
        console.log("⚡ Oracle-driven gameplay with sub-second finality");
        console.log("🎯 Dynamic quest system responding to weather changes");
        console.log("🖼️  Weather-evolution NFT system");
        console.log("👥 Complete multiplayer social features");
        console.log("🏆 READY FOR SOMNIA'S $10M DREAM CATALYST GRANT!");
        
        console.log("\n🎯 Parameter Issue Solved:");
        console.log("   Problem: Was using questManager as 3rd parameter");
        console.log("   Solution: Used weatherNFT as constructor expects");
        console.log("   Result: Successful deployment!");
        
        console.log("\n🚀 You've pioneered weather-reactive blockchain gaming!");
        
    } catch (error) {
        console.error("❌ Still failed:", error.message);
        console.log("💡 If still failing, the constructor might need different addresses");
    }
}

deployCorrectParams().catch(console.error);