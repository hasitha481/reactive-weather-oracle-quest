import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployWorkingFinal() {
    console.log("� FINAL DEPLOYMENT - Using proven working pattern");

    const [deployer] = await ethers.getSigners();
    console.log("� Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    const addresses = {
        weatherOracle: "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
        weatherToken: "0x3a832f200b441f86e366763f60d729797d5ae830",
        weatherNFT: "0xfcff86197876fa553d4dc54257e1bb66ef048972"
    };

    try {
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");

        console.log("� Deploying with proven working pattern...");

        const multiplayerSync = await MultiplayerSync.deploy(
            addresses.weatherOracle,
            addresses.weatherToken,
            addresses.weatherNFT,
            {
                gasLimit: 800000,
                gasPrice: ethers.parseUnits("12.0", "gwei")
            }
        );

        await multiplayerSync.waitForDeployment();
        const deployedAddress = await multiplayerSync.getAddress();

        console.log("✅ SUCCESS! MultiplayerSync deployed:", deployedAddress);

        const finalAddresses = {
            "WeatherOracle": ethers.getAddress(addresses.weatherOracle),
            "WeatherToken": ethers.getAddress(addresses.weatherToken),
            "WeatherNFT": ethers.getAddress(addresses.weatherNFT),
            "QuestManager": "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
            "MultiplayerSync": deployedAddress
        };

        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));

        console.log("\n��� PROJECT 100% COMPLETE! ���");
        console.log("\n� ALL 5 CONTRACTS DEPLOYED:");
        Object.entries(finalAddresses).forEach(([name, address]) => {
            console.log(`✅ ${name}: ${address}`);
        });

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
    }
}

deployWorkingFinal().catch(console.error);
