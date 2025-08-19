// wallet-connection-test.js
// Quick diagnostic script to test wallet and network connectivity

const { ethers } = require('ethers');

async function testWalletConnection() {
  console.log('🔍 Testing Wallet Connection and Network Connectivity...\n');

  // Test 1: Check if we can connect to Somnia RPC
  console.log('1. Testing Somnia Network Connection...');
  try {
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network');
    const network = await provider.getNetwork();
    console.log('✅ Somnia RPC connected successfully');
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Network Name: ${network.name}\n`);
  } catch (error) {
    console.log('❌ Somnia RPC connection failed:', error.message);
    return;
  }

  // Test 2: Check deployed contracts
  console.log('2. Testing Contract Accessibility...');
  const addresses = {
    WeatherOracle: "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
    WeatherToken: "0x3A832f200b441f86E366763f60d729797D5ae830",
    WeatherNFT: "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
    QuestManager: "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
    MultiplayerSync: "0x57231e0A012901920d3D7dd570B9699bD65FF813"
  };

  const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network');
  
  for (const [name, address] of Object.entries(addresses)) {
    try {
      const code = await provider.getCode(address);
      if (code === '0x') {
        console.log(`❌ ${name}: No contract found at ${address}`);
      } else {
        console.log(`✅ ${name}: Contract exists at ${address}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: Error checking contract - ${error.message}`);
    }
  }

  console.log('\n3. Testing Contract Interaction...');
  
  // Test Weather Oracle read function
  try {
    const weatherOracleABI = ["function getCurrentWeather() view returns (uint8)"];
    const weatherOracle = new ethers.Contract(addresses.WeatherOracle, weatherOracleABI, provider);
    const currentWeather = await weatherOracle.getCurrentWeather();
    console.log(`✅ WeatherOracle.getCurrentWeather(): ${currentWeather}`);
  } catch (error) {
    console.log(`❌ WeatherOracle interaction failed: ${error.message}`);
  }

  console.log('\n🎯 Wallet Connection Recommendations:');
  console.log('1. Install MetaMask browser extension if not installed');
  console.log('2. Ensure you have STT tokens for gas fees');
  console.log('3. Add Somnia testnet to MetaMask:');
  console.log('   - Network Name: Somnia Testnet');
  console.log('   - RPC URL: https://dream-rpc.somnia.network');
  console.log('   - Chain ID: 50312');
  console.log('   - Currency Symbol: STT');
  console.log('4. Try connecting wallet from the app interface');
}

testWalletConnection().catch(console.error);