import pkg from 'hardhat';
const { ethers } = pkg;

async function testTransaction() {
    console.log("🧪 Testing simple transaction (not deployment)");
    
    const [deployer] = await ethers.getSigners();
    console.log("Address:", deployer.address);
    
    try {
        // Try sending a simple transaction to yourself
        const tx = await deployer.sendTransaction({
            to: deployer.address,
            value: ethers.parseEther("0.001"),
            gasLimit: 21000,
            gasPrice: ethers.parseUnits("12.0", "gwei")
        });
        
        console.log("✅ Transaction sent:", tx.hash);
        await tx.wait();
        console.log("✅ Transaction confirmed");
        
    } catch (error) {
        console.error("❌ Transaction failed:", error.message);
    }
}

testTransaction().catch(console.error);