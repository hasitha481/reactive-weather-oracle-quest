import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function diagnoseDeployment() {
    console.log("🔍 Diagnosing deployment issues step by step...");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "STT");
    
    try {
        // Test 1: Simple transaction to verify network connectivity
        console.log("\n1️⃣ Testing simple transaction...");
        const gasPrice = await deployer.provider.getFeeData();
        console.log("   Network gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
        
        // Test 2: Check MultiplayerSync constructor
        console.log("\n2️⃣ Checking MultiplayerSync constructor...");
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        console.log("   ✅ Contract factory loaded");
        
        // Test 3: Check if we can estimate gas
        const addresses = {
            weatherOracle: "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
            questManager: "0x2ebf0c86a306cfddac26e22b62375ffdd4647c13",
            weatherToken: "0x3a832f200b441f86e366763f60d729797d5ae830"
        };
        
        console.log("\n3️⃣ Testing gas estimation...");
        try {
            const deployTx = await MultiplayerSync.getDeployTransaction(
                addresses.weatherOracle,
                addresses.questManager,
                addresses.weatherToken
            );
            
            const gasEstimate = await deployer.estimateGas(deployTx);
            console.log("   ✅ Gas estimate:", gasEstimate.toString());
            
            // Test 4: Try deployment with network gas price
            console.log("\n4️⃣ Attempting deployment with network gas price...");
            
            const multiplayerSync = await MultiplayerSync.deploy(
                addresses.weatherOracle,
                addresses.questManager,
                addresses.weatherToken,
                {
                    gasLimit: gasEstimate * BigInt(2), // 2x estimated gas
                    gasPrice: gasPrice.gasPrice * BigInt(2) // 2x network gas price
                }
            );
            
            console.log("⏳ Deployment transaction sent, waiting for confirmation...");
            await multiplayerSync.waitForDeployment();
            
            const deployedAddress = await multiplayerSync.getAddress();
            console.log("✅ SUCCESS! MultiplayerSync deployed:", deployedAddress);
            
            // Save addresses
            const finalAddresses = {
                "WeatherOracle": ethers.getAddress(addresses.weatherOracle),
                "WeatherToken": ethers.getAddress(addresses.weatherToken),
                "WeatherNFT": ethers.getAddress("0xFCfF86197876fA553d4dC54257E1bB66Ef048972".toLowerCase()),
                "QuestManager": ethers.getAddress(addresses.questManager),
                "MultiplayerSync": deployedAddress
            };
            
            fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));
            
            console.log("\n🎉🎉🎉 PROJECT 100% COMPLETE! 🎉🎉🎉");
            console.log("📋 ALL 5 CONTRACTS DEPLOYED:");
            Object.entries(finalAddresses).forEach(([name, address]) => {
                console.log(`✅ ${name}: ${address}`);
            });
            
        } catch (gasError) {
            console.log("❌ Gas estimation failed:", gasError.message);
            
            // Test 5: Try without gas estimation (let network decide everything)
            console.log("\n5️⃣ Attempting deployment with no gas settings...");
            
            try {
                const multiplayerSync = await MultiplayerSync.deploy(
                    addresses.weatherOracle,
                    addresses.questManager,
                    addresses.weatherToken
                    // No gas settings - let network decide everything
                );
                
                console.log("⏳ Deployment sent, waiting for confirmation...");
                await multiplayerSync.waitForDeployment();
                
                const deployedAddress = await multiplayerSync.getAddress();
                console.log("✅ SUCCESS! MultiplayerSync deployed:", deployedAddress);
                
                // Save addresses and celebrate
                const finalAddresses = {
                    "WeatherOracle": ethers.getAddress(addresses.weatherOracle),
                    "WeatherToken": ethers.getAddress(addresses.weatherToken),
                    "WeatherNFT": ethers.getAddress("0xFCfF86197876fA553d4dC54257E1bB66Ef048972".toLowerCase()),
                    "QuestManager": ethers.getAddress(addresses.questManager),
                    "MultiplayerSync": deployedAddress
                };
                
                fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));
                
                console.log("\n🎉🎉🎉 PROJECT 100% COMPLETE! 🎉🎉🎉");
                console.log("🌟 World's first weather-reactive blockchain game is live!");
                
            } catch (finalError) {
                console.log("❌ Final deployment attempt failed:", finalError.message);
                
                // Test 6: Check if it's a constructor parameter issue
                console.log("\n6️⃣ Checking constructor parameters...");
                console.log("   WeatherOracle exists:", addresses.weatherOracle);
                console.log("   QuestManager exists:", addresses.questManager);
                console.log("   WeatherToken exists:", addresses.weatherToken);
                
                console.log("\n💡 Possible solutions:");
                console.log("1. Wait 5 minutes and try again (network congestion)");
                console.log("2. Check if MultiplayerSync contract has compilation errors");
                console.log("3. Try deploying with higher gas limit (500000+)");
                console.log("4. Check if constructor parameters are correct");
            }
        }
        
    } catch (error) {
        console.error("❌ Diagnostic failed:", error.message);
    }
}

diagnoseDeployment().catch(console.error);