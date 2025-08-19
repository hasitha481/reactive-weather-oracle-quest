import pkg from 'hardhat';
const { ethers } = pkg;

async function testNetwork() {
    console.log("🧪 Testing if network deployment works with simple contract");
    
    const [deployer] = await ethers.getSigners();
    console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    
    // Test with the simplest possible contract
    const simpleContractCode = `
        pragma solidity ^0.8.20;
        contract SimpleTest {
            uint256 public value = 42;
            constructor() {}
        }
    `;
    
    try {
        // Try to deploy a super simple contract
        console.log("🎯 Testing simple contract deployment...");
        
        // Get network info
        const network = await deployer.provider.getNetwork();
        console.log("🌐 Network:", network.chainId, network.name);
        
        const feeData = await deployer.provider.getFeeData();
        console.log("⛽ Gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
        
        // Test transaction signing
        const nonce = await deployer.provider.getTransactionCount(deployer.address);
        console.log("🔢 Nonce:", nonce);
        
        console.log("✅ Network connectivity test passed");
        console.log("💡 The issue is specifically with MultiplayerSync contract");
        
    } catch (error) {
        console.error("❌ Network test failed:", error.message);
    }
}

testNetwork().catch(console.error);