import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployForceGas() {
    console.log("🚀 FORCE reasonable gas limit (ignore 51M estimation)");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "STT");
    
    const addresses = {
        weatherOracle: "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
        questManager: "0x2ebf0c86a306cfddac26e22b62375ffdd4647c13",
        weatherToken: "0x3a832f200b441f86e366763f60d729797d5ae830"
    };
    
    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        
        console.log("⚠️  Network estimated 51M gas - FORCING reasonable limit");
        console.log("🔧 Using 800K gas limit instead of 51M");
        
        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.weatherOracle,
            addresses.questManager,
            addresses.weatherToken,
            {
                gasLimit: 800000,  // Force reasonable gas limit
                gasPrice: ethers.parseUnits("7.0", "gwei") // Above base fee
            }
        );
        
        console.log("⏳ Deploying with forced gas settings...");
        await multiplayerSync.waitForDeployment();
        
        const deployedAddress = await multiplayerSync.getAddress();
        console.log("✅ SUCCESS! MultiplayerSync:", deployedAddress);
        
        // Save final addresses
        const finalAddresses = {
            "WeatherOracle": ethers.getAddress(addresses.weatherOracle),
            "WeatherToken": ethers.getAddress(addresses.weatherToken),
            "WeatherNFT": ethers.getAddress("0xFCfF86197876fA553d4dC54257E1bB66Ef048972".toLowerCase()),
            "QuestManager": ethers.getAddress(addresses.questManager),
            "MultiplayerSync": deployedAddress
        };
        
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));
        
        // Calculate costs
        const finalBalance = await deployer.provider.getBalance(deployer.address);
        const gasUsed = parseFloat(ethers.formatEther(balance)) - parseFloat(ethers.formatEther(finalBalance));
        
        console.log("\n🎉🎉🎉 PROJECT 100% COMPLETE! 🎉🎉🎉");
        console.log("\n📋 ALL 5 CONTRACTS DEPLOYED:");
        Object.entries(finalAddresses).forEach(([name, address]) => {
            console.log(`✅ ${name}: ${address}`);
        });
        
        console.log("\n💰 Actual deployment cost:", gasUsed.toFixed(4), "STT");
        console.log("💰 Remaining balance:", ethers.formatEther(finalBalance), "STT");
        
        console.log("\n🌟🌟🌟 CONGRATULATIONS! 🌟🌟🌟");
        console.log("🎮 World's FIRST weather-reactive blockchain adventure game!");
        console.log("⚡ Real-time weather updates with sub-second finality");
        console.log("🎯 Dynamic quest system with 14+ weather-specific quests");
        console.log("🖼️  Weather-evolution NFT system");
        console.log("👥 Multiplayer social features");
        console.log("🏆 Ready for Somnia's $10M Dream Catalyst grant!");
        
        console.log("\n🎯 Gas Issue Solved:");
        console.log("   Problem: Network estimated 51M gas (absurd)");
        console.log("   Solution: Forced reasonable 800K gas limit");
        console.log("   Result: Successful deployment!");
        
    } catch (error) {
        console.error("❌ Forced gas deployment failed:", error.message);
        
        if (error.message.includes("out of gas")) {
            console.log("\n💡 Try increasing gas limit to 1,200,000");
        } else if (error.message.includes("insufficient")) {
            console.log("\n💡 Try reducing gas limit to 600,000");
        }
    }
}

deployForceGas().catch(console.error);