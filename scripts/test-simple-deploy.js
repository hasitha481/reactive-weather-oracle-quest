import pkg from 'hardhat';
const { ethers } = pkg;

async function testSimpleDeploy() {
    console.log("🧪 Testing SIMPLEST possible deployment");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "STT");
    
    // Check nonce
    const nonce = await deployer.provider.getTransactionCount(deployer.address);
    console.log("🔢 Current nonce:", nonce);
    
    try {
        // Try deploying the simple weather token that already works
        const SimpleWeatherToken = await ethers.getContractFactory("SimpleWeatherToken");
        
        console.log("🚀 Deploying SimpleWeatherToken (known working contract)...");
        
        const token = await SimpleWeatherToken.deploy({
            gasLimit: 200000,
            gasPrice: ethers.parseUnits("12.0", "gwei"),
            nonce: nonce
        });
        
        await token.waitForDeployment();
        console.log("✅ SUCCESS! Contract deployed:", await token.getAddress());
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        console.error("Error code:", error.code);
        console.error("Error data:", error.data);
    }
}

testSimpleDeploy().catch(console.error);