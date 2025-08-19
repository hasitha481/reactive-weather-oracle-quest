import hre from 'hardhat';
const { ethers } = hre;

async function main() {
    console.log("🚀 Simple deployment to Somnia Network...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", await deployer.getAddress());
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "STT");

    try {
        // Deploy WeatherOracle only for testing
        console.log("\n📡 Deploying WeatherOracle...");
        const WeatherOracle = await ethers.getContractFactory("WeatherOracle");
        const weatherOracle = await WeatherOracle.deploy();
        await weatherOracle.waitForDeployment();
        
        const address = await weatherOracle.getAddress();
        console.log("✅ WeatherOracle deployed to:", address);
        console.log("🎉 Deployment successful!");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        console.log("\n💡 Debugging info:");
        console.log("- Network: Somnia Testnet");
        console.log("- Chain ID: 50312");
        console.log("- Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "STT");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });