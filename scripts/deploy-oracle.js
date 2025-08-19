const { ethers } = require("hardhat");

async function main() {
    console.log("🌦️ Deploying WeatherOracle to Somnia Testnet...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    const WeatherOracle = await ethers.getContractFactory("WeatherOracle");
    console.log("Deploying contract...");
    
    const weatherOracle = await WeatherOracle.deploy();
    await weatherOracle.waitForDeployment();
    
    const address = await weatherOracle.getAddress();
    console.log("✅ WeatherOracle deployed to:", address);
    
    // Test the contract
    const totalZones = await weatherOracle.totalZones();
    console.log("📍 Total zones:", totalZones.toString());
    
    // Check first zone
    const weather = await weatherOracle.getCurrentWeather(0);
    console.log("🌤️ Zone 0 weather type:", weather.weatherType.toString());
    console.log("🌤️ Zone 0 intensity:", weather.intensity.toString());
    
    console.log("\n🎯 Next step:");
    console.log("npm run deploy:quest --", address);
    
    return address;
}

if (require.main === module) {
    main().catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
}

module.exports = main;