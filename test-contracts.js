// FILE: test-contracts.js
const { ethers } = require("hardhat");

async function testContracts() {
    console.log("🔍 Testing contract interactions...");
    
    try {
        // Get deployed contracts (replace with your addresses from deployed-addresses.json)
        const weatherOracleAddress = "YOUR_WEATHER_ORACLE_ADDRESS";
        const weatherTokenAddress = "YOUR_WEATHER_TOKEN_ADDRESS";
        
        // Get contract instances
        const WeatherOracle = await ethers.getContractFactory("EnhancedWeatherOracle");
        const WeatherToken = await ethers.getContractFactory("WeatherToken");
        
        const weatherOracle = WeatherOracle.attach(weatherOracleAddress);
        const weatherToken = WeatherToken.attach(weatherTokenAddress);
        
        // Test weather oracle
        console.log("Testing Weather Oracle...");
        const weatherData = await weatherOracle.getWeatherData(0);
        console.log("✅ Weather data retrieved:", weatherData);
        
        // Test token contract
        console.log("Testing Weather Token...");
        const [signer] = await ethers.getSigners();
        const balance = await weatherToken.balanceOf(signer.address);
        console.log("✅ Token balance:", ethers.utils.formatEther(balance));
        
        console.log("🎉 All contract tests passed!");
        
    } catch (error) {
        console.error("❌ Contract test failed:", error.message);
    }
}

testContracts();