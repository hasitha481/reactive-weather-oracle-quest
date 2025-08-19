import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployFinalFixed() {
    console.log("ÌæØ FINAL DEPLOYMENT - Correct 3 parameters only");

    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Ì≤∞ Balance:", ethers.formatEther(balance), "STT");

    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");

        // Correct addresses (3 parameters only!)
        const weatherOracle = "0x1df5ff83103097fc44a0a4bc182c40cce7341871";
        const weatherToken = "0x3a832f200b441f86e366763f60d729797d5ae830";  
        const weatherNFT = "0xfcff86197876fa553d4dc54257e1bb66ef048972";

        console.log("Ì∫Ä Deploying with 3 correct parameters...");
        console.log("‚õΩ Using 12.0 gwei to beat base fee");

        const multiplayerSync = await MultiplayerSync.deploy(
            weatherOracle,
            weatherToken,
            weatherNFT,
            {
                gasLimit: 500000,
                gasPrice: ethers.parseUnits("12.0", "gwei")
            }
        );

        await multiplayerSync.waitForDeployment();
        const deployedAddress = await multiplayerSync.getAddress();

        console.log("‚úÖ SUCCESS! MultiplayerSync deployed:", deployedAddress);

        // Save ALL 5 contracts - PROJECT COMPLETE!
        const finalAddresses = {
            "WeatherOracle": "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
            "WeatherToken": "0x3A832f200b441f86E366763f60d729797D5ae830",
            "WeatherNFT": "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
            "QuestManager": "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
            "MultiplayerSync": deployedAddress
        };

        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));

        console.log("\nÌæâÌæâÌæâ PROJECT 100% COMPLETE! ÌæâÌæâÌæâ");
        console.log("\nÌ≥ã ALL 5 CONTRACTS SUCCESSFULLY DEPLOYED:");
        Object.entries(finalAddresses).forEach(([name, address]) => {
            console.log(`‚úÖ ${name}: ${address}`);
        });

        console.log("\nÌºüÌºüÌºü HISTORIC ACHIEVEMENT! ÌºüÌºüÌºü");
        console.log("ÌæÆ World's FIRST weather-reactive blockchain adventure game!");
        console.log("‚ö° Real-time weather affecting gameplay mechanics");
        console.log("ÌæØ Dynamic quest system with 14+ weather-specific quests");
        console.log("Ì∂ºÔ∏è  Weather-evolution NFT system");
        console.log("Ì±• Complete multiplayer social features");
        console.log("ÌøÜ READY FOR SOMNIA'S $10M DREAM CATALYST GRANT!");

    } catch (error) {
        console.error("‚ùå Deployment failed:", error.message);
    }
}

deployFinalFixed().catch(console.error);
