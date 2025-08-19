// FILE: test-contracts-debug.js
// Run this to debug your Somnia contracts and find the exact issue

const { ethers } = require('ethers');

async function debugSomniaContracts() {
  try {
    console.log('🔍 Debugging Reactive Weather Oracle Quest contracts...');
    
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network');
    
    // Test basic connection
    const network = await provider.getNetwork();
    console.log('📡 Connected to network:', network.name, 'Chain ID:', network.chainId.toString());
    
    // Contract addresses
    const contracts = {
      weatherOracle: '0x1Df5FF83103097FC44A0a4BC182c40ccE7341871',
      questManager: '0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13',
      weatherToken: '0x3A832f200b441f86E366763f60d729797D5ae830',
      weatherNFT: '0xFCfF86197876fA553d4dC54257E1bB66Ef048972'
    };
    
    // Basic ABIs for testing
    const questManagerABI = [
      "function getCurrentWeather() view returns (uint8)",
      "function getTotalQuests() view returns (uint256)", 
      "function getQuestDetails(uint256 questId) view returns (uint8 requiredWeather, uint256 reward, uint256 difficulty, bool active, uint256 completions, string description)",
      "function getContractBalance() view returns (uint256)",
      "function getAvailableQuests() view returns (uint256[])"
    ];
    
    const weatherOracleABI = [
      "function getCurrentWeather(uint256 zone) view returns (tuple(uint8 weatherType, uint256 intensity, uint256 startTime, uint256 duration, uint256 zone, bool isActive, uint256 rarityBonus))"
    ];
    
    const weatherTokenABI = [
      "function balanceOf(address account) view returns (uint256)",
      "function totalSupply() view returns (uint256)"
    ];
    
    // Initialize contracts
    const questManager = new ethers.Contract(contracts.questManager, questManagerABI, provider);
    const weatherOracle = new ethers.Contract(contracts.weatherOracle, weatherOracleABI, provider);
    const weatherToken = new ethers.Contract(contracts.weatherToken, weatherTokenABI, provider);
    
    console.log('\n🎮 === QUEST MANAGER ANALYSIS ===');
    
    // Check if contracts exist
    const questManagerCode = await provider.getCode(contracts.questManager);
    console.log('📋 QuestManager contract exists:', questManagerCode.length > 2);
    
    if (questManagerCode.length > 2) {
      try {
        // Get current weather from QuestManager
        const currentWeather = await questManager.getCurrentWeather();
        console.log('🌤️ Current weather in QuestManager:', currentWeather.toString());
        
        // Get total quests
        const totalQuests = await questManager.getTotalQuests();
        console.log('🎲 Total quests in contract:', totalQuests.toString());
        
        // Get contract token balance
        const contractBalance = await questManager.getContractBalance();
        console.log('💰 QuestManager token balance:', ethers.formatEther(contractBalance), 'tokens');
        
        // Get available quests
        try {
          const availableQuests = await questManager.getAvailableQuests();
          console.log('✅ Available quest IDs:', availableQuests.map(q => q.toString()));
        } catch (e) {
          console.log('⚠️ Could not get available quests:', e.message);
        }
        
        // Check quest details for IDs 1-10
        console.log('\n📝 Quest Details Analysis:');
        for (let questId = 1; questId <= 10; questId++) {
          try {
            const details = await questManager.getQuestDetails(questId);
            const weatherTypes = ['Clear', 'Storm', 'Sunshine', 'Fog', 'Rain', 'Snow', 'Universal'];
            console.log(`Quest ${questId}:`, {
              requiredWeather: `${details[0]} (${weatherTypes[details[0]] || 'Unknown'})`,
              reward: ethers.formatEther(details[1]) + ' tokens',
              difficulty: details[2].toString(),
              active: details[3],
              completions: details[4].toString(),
              description: details[5]
            });
          } catch (e) {
            console.log(`❌ Quest ${questId}: ${e.message}`);
            break; // Stop if we hit an invalid quest ID
          }
        }
        
      } catch (error) {
        console.log('❌ QuestManager calls failed:', error.message);
      }
    }
    
    console.log('\n🌦️ === WEATHER ORACLE ANALYSIS ===');
    
    const weatherOracleCode = await provider.getCode(contracts.weatherOracle);
    console.log('🌤️ WeatherOracle contract exists:', weatherOracleCode.length > 2);
    
    if (weatherOracleCode.length > 2) {
      try {
        const weatherData = await weatherOracle.getCurrentWeather(0);
        const weatherTypes = ['Clear', 'Storm', 'Blizzard', 'Fog', 'Rain', 'Drought', 'Aurora', 'Eclipse'];
        console.log('🌈 Weather Oracle current weather:', {
          type: `${weatherData.weatherType} (${weatherTypes[weatherData.weatherType] || 'Unknown'})`,
          intensity: weatherData.intensity.toString(),
          isActive: weatherData.isActive,
          zone: weatherData.zone.toString()
        });
      } catch (error) {
        console.log('❌ WeatherOracle calls failed:', error.message);
      }
    }
    
    console.log('\n💎 === TOKEN ANALYSIS ===');
    
    const tokenCode = await provider.getCode(contracts.weatherToken);
    console.log('🪙 WeatherToken contract exists:', tokenCode.length > 2);
    
    if (tokenCode.length > 2) {
      try {
        const totalSupply = await weatherToken.totalSupply();
        console.log('📊 Total token supply:', ethers.formatEther(totalSupply), 'tokens');
        
        // Check if QuestManager has tokens
        const questManagerTokens = await weatherToken.balanceOf(contracts.questManager);
        console.log('💰 QuestManager token balance:', ethers.formatEther(questManagerTokens), 'tokens');
        
      } catch (error) {
        console.log('❌ Token calls failed:', error.message);
      }
    }
    
    console.log('\n🔍 === PROBLEM DIAGNOSIS ===');
    
    // Try to identify the specific issue
    console.log('Analyzing why quest completion fails...');
    
    try {
      const questManagerWeather = await questManager.getCurrentWeather();
      const oracleWeather = await weatherOracle.getCurrentWeather(0);
      
      if (questManagerWeather.toString() !== oracleWeather.weatherType.toString()) {
        console.log('⚠️ WEATHER MISMATCH detected!');
        console.log(`   QuestManager weather: ${questManagerWeather}`);
        console.log(`   WeatherOracle weather: ${oracleWeather.weatherType}`);
        console.log('   Solution: Update QuestManager weather or check oracle sync');
      }
      
      const contractBalance = await questManager.getContractBalance();
      if (contractBalance.toString() === '0') {
        console.log('⚠️ CONTRACT NOT FUNDED!');
        console.log('   QuestManager has 0 tokens for rewards');
        console.log('   Solution: Fund the contract with tokens');
      }
      
      // Check if quest 1 exists and is active
      const quest1Details = await questManager.getQuestDetails(1);
      if (!quest1Details[3]) {
        console.log('⚠️ QUEST 1 NOT ACTIVE!');
        console.log('   Quest 1 is disabled in the contract');
        console.log('   Solution: Find active quest IDs or activate quest 1');
      }
      
      console.log('\n✅ Diagnosis complete! Check warnings above for specific issues.');
      
    } catch (error) {
      console.log('❌ Could not complete diagnosis:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  }
}

// Run the debug
debugSomniaContracts().then(() => {
  console.log('\n🎯 Debug complete! Use the findings above to fix contract issues.');
}).catch(console.error);