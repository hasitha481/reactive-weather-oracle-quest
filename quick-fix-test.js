const fs = require('fs');

console.log('� QUICK FIX VERIFICATION');
console.log('========================');

// Check 1: Correct directory
console.log('� Current directory:', process.cwd());
console.log('✅ Should contain contracts/, frontend/, scripts/ folders');

// Check 2: OpenZeppelin version
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const ozVersion = pkg.dependencies['@openzeppelin/contracts'];
  if (ozVersion === '4.9.3') {
    console.log('✅ OpenZeppelin version correct:', ozVersion);
  } else {
    console.log('❌ OpenZeppelin version wrong:', ozVersion);
  }
} catch (e) {
  console.log('❌ Cannot read package.json');
}

// Check 3: .env file
try {
  const env = fs.readFileSync('.env', 'utf8');
  if (env.includes('PRIVATE_KEY=cfdc9b5df5c8cda224bf97e777e3e7f52aaac7212ae9504da102e9fcde27ae24')) {
    console.log('✅ Private key format correct');
  } else {
    console.log('❌ Private key format wrong');
  }
} catch (e) {
  console.log('❌ .env file missing');
}

// Check 4: Contract files
const contracts = ['EnhancedWeatherOracle.sol', 'WeatherToken.sol', 'WeatherNFT.sol', 'QuestManager.sol'];
contracts.forEach(contract => {
  if (fs.existsSync(`contracts/${contract}`)) {
    console.log(`✅ ${contract} exists`);
  } else {
    console.log(`❌ ${contract} missing`);
  }
});

// Check 5: Frontend files
if (fs.existsSync('frontend/public/index.html')) {
  console.log('✅ Frontend index.html exists');
} else {
  console.log('❌ Frontend index.html missing');
}

console.log('\n� Run these commands if you see ❌:');
console.log('1. cd .. (if in wrong directory)');
console.log('2. npm uninstall @openzeppelin/contracts');
console.log('3. npm install @openzeppelin/contracts@4.9.3 --save-exact');
console.log('4. Fix .env file with correct format');
console.log('5. npx hardhat compile');
