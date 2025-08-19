import pkg from 'hardhat';
const { ethers } = pkg;

async function testDeploy() {
    console.log("🧪 Testing deployment with NO constructor parameters");
    
    const [deployer] = await ethers.getSigners();
    console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    
    try {
        const TestDeploy = await ethers.getContractFactory("TestDeploy");
        
        const testContract = await TestDeploy.deploy({
            gasLimit: 200000,
            gasPrice: ethers.parseUnits("12.0", "gwei")
        });
        
        await testContract.waitForDeployment();
        console.log("✅ SUCCESS! TestDeploy deployed:", await testContract.getAddress());
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        console.error("Full error:", error);
    }
}

testDeploy().catch(console.error);