import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function deployFixed() {
    console.log("ÌæØ Deploying FIXED contract (no nested mappings)");

    const [deployer] = await ethers.getSigners();
    console.log("Ì≤∞ Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    try {
        const MultiplayerSyncFixed = await ethers.getContractFactory("MultiplayerSyncFixed");

        const multiplayerSync = await MultiplayerSyncFixed.deploy(
            "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
            "0x3a832f200b441f86e366763f60d729797d5ae830",
            "0xfcff86197876fa553d4dc54257e1bb66ef048972",
            {
                gasLimit: 800000,
                gasPrice: ethers.parseUnits("12.0", "gwei")
            }
        );

        await multiplayerSync.waitForDeployment();
        const deployedAddress = await multiplayerSync.getAddress();

        console.log("‚úÖ SUCCESS! MultiplayerSyncFixed deployed:", deployedAddress);

        const finalAddresses = {
            "WeatherOracle": "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
            "WeatherToken": "0x3A832f200b441f86E366763f60d729797D5ae830",
            "WeatherNFT": "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
            "QuestManager": "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
            "MultiplayerSync": deployedAddress
        };

        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(finalAddresses, null, 2));

        console.log("\nÌæâÌæâÌæâ PROJECT 100% COMPLETE! ÌæâÌæâÌæâ");

    } catch (error) {
        console.error("‚ùå Deployment failed:", error.message);
    }
}

deployFixed().catch(console.error);
