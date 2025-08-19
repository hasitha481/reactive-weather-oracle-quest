// ================================================
// FILE: scripts/deploySimple.js
// Copy this exact content - SIMPLIFIED DEPLOYMENT
// ================================================

const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying Simple Weather Oracle Quest...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "wei\n");

  const deployedContracts = {};

  try {
    // 1. Deploy Simple Weather Oracle
    console.log("📡 Deploying Simple Weather Oracle...");
    const SimpleWeatherOracle = await ethers.getContractFactory("SimpleWeatherOracle");
    const weatherOracle = await SimpleWeatherOracle.deploy();
    await weatherOracle.deployed();
    deployedContracts.weatherOracle = weatherOracle.address;
    console.log("✅ Simple Weather Oracle deployed to:", weatherOracle.address);

    // 2. Deploy Simple Weather Token
    console.log("\n💰 Deploying Simple Weather Token...");
    const SimpleWeatherToken = await ethers.getContractFactory("SimpleWeatherToken");
    const weatherToken = await SimpleWeatherToken.deploy();
    await weatherToken.deployed();
    deployedContracts.weatherToken = weatherToken.address;
    console.log("✅ Simple Weather Token deployed to:", weatherToken.address);

    // 3. Configure contracts
    console.log("\n🔗 Configuring contracts...");
    await weatherToken.setWeatherOracle(weatherOracle.address);
    console.log("✅ Contracts configured!");

    // 4. Add extra zones
    console.log("\n⚙️ Adding weather zones...");
    await weatherOracle.addWeatherZone(); // Zone 3
    await weatherOracle.addWeatherZone(); // Zone 4
    console.log("✅ Weather zones added!");

    // 5. Save deployment info
    const deploymentInfo = {
      network: "Somnia Testnet",
      chainId: 50312,
      deployedAt: new Date().toISOString(),
      deployer: deployer.address,
      contracts: deployedContracts,
      features: [
        "Real-time weather oracle with voting",
        "Weather token with quest rewards",
        "Sub-second transaction finality",
        "Community weather control"
      ]
    };

    fs.writeFileSync('deployed-addresses.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("\n✅ Deployment saved to deployed-addresses.json");

    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT COMPLETE! 🎉");
    console.log("=".repeat(50));
    console.log("\n📋 DEPLOYED CONTRACTS:");
    console.log("Weather Oracle:", deployedContracts.weatherOracle);
    console.log("Weather Token:", deployedContracts.weatherToken);

    console.log("\n🌟 FEATURES READY:");
    console.log("✅ Weather voting system");
    console.log("✅ Token rewards");
    console.log("✅ Multiple weather zones");
    console.log("✅ Real-time updates");

    console.log("\n🎯 READY FOR GRANT DEMO!");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });