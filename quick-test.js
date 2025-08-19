// ================================================
// FILE: quick-test.js
// PURPOSE: Quick verification script to check if everything works
// RUN: node quick-test.js
// ================================================

const fs = require('fs');
const path = require('path');

console.log('🎯 WEATHER ORACLE QUEST - QUICK VERIFICATION');
console.log('='.repeat(50));

let score = 0;
let maxScore = 10;

// Test 1: Check contract files exist
console.log('\n📄 TEST 1: Contract Files');
const contractFiles = [
    'contracts/EnhancedWeatherOracle.sol',
    'contracts/WeatherToken.sol', 
    'contracts/WeatherNFT.sol',
    'contracts/QuestManager.sol'
];

contractFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
        score += 0.5;
    } else {
        console.log(`❌ ${file} missing`);
    }
});

// Test 2: Check package.json has dependencies
console.log('\n📦 TEST 2: Dependencies');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.dependencies && packageJson.dependencies['@openzeppelin/contracts']) {
        console.log('✅ OpenZeppelin contracts in dependencies');
        score += 1;
    } else {
        console.log('❌ Missing OpenZeppelin contracts dependency');
    }
    
    if (packageJson.dependencies && packageJson.dependencies['ethers']) {
        console.log('✅ Ethers.js in dependencies');
        score += 0.5;
    } else {
        console.log('❌ Missing ethers dependency');
    }
} catch (error) {
    console.log('❌ Error reading package.json');
}

// Test 3: Check hardhat config
console.log('\n🔧 TEST 3: Hardhat Configuration');
if (fs.existsSync('hardhat.config.js')) {
    const config = fs.readFileSync('hardhat.config.js', 'utf8');
    if (config.includes('somniaTestnet')) {
        console.log('✅ Somnia testnet configured');
        score += 1;
    } else {
        console.log('❌ Somnia testnet not configured');
    }
    
    if (config.includes('0.8.19')) {
        console.log('✅ Correct Solidity version (0.8.19)');
        score += 0.5;
    } else {
        console.log('❌ Check Solidity version in hardhat.config.js');
    }
} else {
    console.log('❌ hardhat.config.js missing');
}

// Test 4: Check environment file
console.log('\n🔐 TEST 4: Environment Configuration');
if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('PRIVATE_KEY=')) {
        console.log('✅ Private key configured');
        score += 1;
    } else {
        console.log('❌ Private key not configured');
    }
    
    if (envContent.includes('SOMNIA_RPC_URL=')) {
        console.log('✅ Somnia RPC URL configured');
        score += 0.5;
    } else {
        console.log('❌ Somnia RPC URL not configured');
    }
} else {
    console.log('❌ .env file missing');
    console.log('💡 Create .env file with:');
    console.log('   PRIVATE_KEY=your_private_key_without_0x');
    console.log('   SOMNIA_RPC_URL=https://testnet-rpc.somnia.network');
}

// Test 5: Check deployment script
console.log('\n🚀 TEST 5: Deployment Script');
if (fs.existsSync('scripts/deploy.js')) {
    const deployScript = fs.readFileSync('scripts/deploy.js', 'utf8');
    if (deployScript.includes('EnhancedWeatherOracle')) {
        console.log('✅ Enhanced deployment script exists');
        score += 1;
    } else {
        console.log('❌ Deployment script needs updating');
    }
} else {
    console.log('❌ scripts/deploy.js missing');
}

// Test 6: Check if deployed
console.log('\n📍 TEST 6: Deployment Status');
if (fs.existsSync('deployed-addresses.json')) {
    try {
        const deployed = JSON.parse(fs.readFileSync('deployed-addresses.json', 'utf8'));
        if (deployed.contracts && Object.keys(deployed.contracts).length >= 4) {
            console.log('✅ Contracts deployed successfully');
            console.log(`📋 Found ${Object.keys(deployed.contracts).length} deployed contracts`);
            score += 2;
        } else {
            console.log('⚠️ Partial deployment found');
            score += 1;
        }
    } catch (error) {
        console.log('❌ Error reading deployment file');
    }
} else {
    console.log('❌ No deployment found');
    console.log('💡 Run: npm run deploy:somnia');
}

// Test 7: Check frontend structure
console.log('\n🎨 TEST 7: Frontend Structure');
if (fs.existsSync('frontend/src/App.jsx')) {
    console.log('✅ Frontend App.jsx exists');
    score += 1;
} else {
    console.log('❌ Frontend App.jsx missing');
}

if (fs.existsSync('frontend/package.json')) {
    console.log('✅ Frontend package.json exists');
    score += 0.5;
} else {
    console.log('❌ Frontend package.json missing');
}

// Test 8: Advanced feature check
console.log('\n🌟 TEST 8: Advanced Features');
const oracleFile = 'contracts/EnhancedWeatherOracle.sol';
if (fs.existsSync(oracleFile)) {
    const oracleContent = fs.readFileSync(oracleFile, 'utf8');
    if (oracleContent.includes('voteForWeather')) {
        console.log('✅ Community voting feature present');
        score += 0.5;
    }
    if (oracleContent.includes('WeatherVoteCast')) {
        console.log('✅ Real-time events configured');
        score += 0.5;
    }
}

// Final Score and Recommendations
console.log('\n🎯 FINAL VERIFICATION RESULTS');
console.log('='.repeat(50));
console.log(`📊 Score: ${score}/${maxScore} (${Math.round(score/maxScore*100)}%)`);

if (score >= 9) {
    console.log('🏆 EXCELLENT! Ready for grant submission!');
    console.log('✨ Your project showcases:');
    console.log('   • Advanced smart contracts');
    console.log('   • Real-time multiplayer features');
    console.log('   • Dynamic NFT evolution');
    console.log('   • Weather-reactive gameplay');
    console.log('   • Perfect for Somnia grants!');
} else if (score >= 7) {
    console.log('⚠️  GOOD! Almost ready - fix remaining issues');
    console.log('🔧 Next steps:');
    if (score < 9) console.log('   • Complete deployment if missing');
    if (score < 8) console.log('   • Check frontend setup');
} else if (score >= 5) {
    console.log('🔧 NEEDS WORK - Follow troubleshooting guide');
    console.log('📝 Priority fixes:');
    console.log('   • Install dependencies: npm install @openzeppelin/contracts@4.9.3');
    console.log('   • Create .env file with private key');
    console.log('   • Deploy contracts: npm run deploy:somnia');
} else {
    console.log('🔄 START OVER - Check file structure');
    console.log('📋 Essential steps:');
    console.log('   1. Verify all contract files exist');
    console.log('   2. Install dependencies');
    console.log('   3. Configure environment');
    console.log('   4. Deploy contracts');
}

console.log('\n💡 QUICK FIXES:');
console.log('🔧 Install dependencies: npm install @openzeppelin/contracts@4.9.3 ethers@5.7.2');
console.log('🔧 Compile contracts: npx hardhat compile');
console.log('🔧 Deploy contracts: npx hardhat run scripts/deploy.js --network somniaTestnet');

console.log('\n🎬 DEMO READY CHECKLIST:');
console.log('□ All contracts deployed');
console.log('□ Frontend shows weather zones');
console.log('□ Can connect MetaMask wallet');
console.log('□ Can vote for weather changes');
console.log('□ Can mint NFTs');
console.log('□ Real-time updates work');

console.log('\nRun this script again after fixes to recheck! 🔄');
console.log('When you get 9+/10, you\'re ready for the grants! 🎉');