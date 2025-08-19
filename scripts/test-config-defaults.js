import pkg from 'hardhat';
const { ethers } = pkg;

async function testConfigDefaults() {
    console.log("🧪 Testing with hardhat.config.js defaults");
    
    const [deployer] = await ethers.getSigners();
    console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    
    try {
        // Use NO gas overrides - let hardhat.config.js handle it
        const SimpleWeatherToken = await ethers.getContractFactory("SimpleWeatherToken");
        
        console.log("🚀 Deploying with config defaults (1 gwei, 3M gas)...");
        
        const token = await SimpleWeatherToken.deploy(); // NO gas parameters!
        
        await token.waitForDeployment();
        console.log("✅ SUCCESS! Token deployed:", await token.getAddress());
        
    } catch (error) {
        console.error("❌ Still failed:", error.message);
    }
}

testConfigDefaults().catch(console.error);