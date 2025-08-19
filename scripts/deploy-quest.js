const { ethers } = require("hardhat");

async function main() {
    // Try multiple ways to get the oracle address
    const weatherOracleAddress = process.env.WEATHER_ORACLE_ADDRESS || 
                                 process.argv[process.argv.length - 1];
    
    // Validate it's a proper address
    if (!weatherOracleAddress || !weatherOracleAddress.startsWith('0x') || weatherOracleAddress.length !== 42) {
        console.error("❌ Please provide a valid WeatherOracle address!");
        console.log("Option 1: Set environment variable:");
        console.log("  WEATHER_ORACLE_ADDRESS=0x66c51f5b9778B59637a4BC4C39c6509898560BC3 npm run deploy:quest");
        console.log("Option 2: Direct deployment with address:");
        console.log("  Use the deploy command below instead.");
        process.exit(1);
    }
    
    console.log("⚔️ Deploying QuestManager to Somnia Testnet...");
    console.log("Using WeatherOracle at:", weatherOracleAddress);
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    const QuestManager = await ethers.getContractFactory("QuestManager");
    console.log("Deploying contract...");
    
    const questManager = await QuestManager.deploy(weatherOracleAddress);
    await questManager.waitForDeployment();
    
    const address = await questManager.getAddress();
    console.log("✅ QuestManager deployed to:", address);
    
    // Create a sample quest
    console.log("🎯 Creating sample quest...");
    const tx = await questManager.createQuest(
        "Herb Collector",
        "Collect 10 healing herbs from the forest",
        0, // GATHER
        0, // zone 0 (Central Plains)
        0, // CLEAR weather
        10, // target amount
        100, // experience
        50, // coins
        3600 // 1 hour (3600 seconds)
    );
    await tx.wait();
    console.log("✅ Sample quest created!");
    
    const totalQuests = await questManager.totalQuests();
    console.log("📋 Total quests:", totalQuests.toString());
    
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("WeatherOracle:", weatherOracleAddress);
    console.log("QuestManager:", address);
    console.log("\n🎮 Your weather oracle quest game is ready!");
    console.log("🌦️ Try changing weather and see quest bonuses activate!");
    
    return address;
}

if (require.main === module) {
    main().catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
}

module.exports = main;