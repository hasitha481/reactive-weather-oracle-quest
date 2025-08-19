import pkg from 'hardhat';
const { ethers } = pkg;

async function testSimple() {
    console.log("🧪 Testing simple deployment with network defaults");
    
    const [deployer] = await ethers.getSigners();
    console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    
    try {
        // Get network gas price
        const feeData = await deployer.provider.getFeeData();
        console.log("🌐 Network gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
        
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        console.log("✅ Contract factory loaded");
        
        // Try with higher gas price and let network estimate gas
        const multiplayerSync = await MultiplayerSync.deploy(
            "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
            "0x3a832f200b441f86e366763f60d729797d5ae830", 
            "0xfcff86197876fa553d4dc54257e1bb66ef048972",
            {
                gasPrice: feeData.gasPrice * BigInt(3) // 3x network gas price
                // Let network estimate gas limit
            }
        );
        
        console.log("⏳ Deploying with 3x network gas price...");
        await multiplayerSync.waitForDeployment();
        
        const address = await multiplayerSync.getAddress();
        console.log("🎉 SUCCESS! Address:", address);
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.log("\n🔍 Debugging info:");
        console.log("- Constructor needs 3 parameters: weatherOracle, weatherToken, weatherNFT");
        console.log("- _createInitialAchievements() should be commented out with //");
        console.log("- Try higher gas price or wait a few minutes");
    }
}

testSimple().catch(console.error);