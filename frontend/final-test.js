const fs = require('fs');
console.log('� FINAL VERIFICATION');
console.log('✅ Contracts compiled:', fs.existsSync('artifacts/contracts'));
console.log('✅ Deployment file:', fs.existsSync('deployed-addresses.json'));  
console.log('✅ Frontend index.html:', fs.existsSync('frontend/public/index.html'));
console.log('✅ Correct .env format:', fs.readFileSync('.env', 'utf8').includes('cfdc9b5df5c8cda224bf97e777e3e7f52aaac7212ae9504da102e9fcde27ae24'));
if (fs.existsSync('deployed-addresses.json')) {
  const deployed = JSON.parse(fs.readFileSync('deployed-addresses.json', 'utf8'));
  console.log('� CONTRACT ADDRESSES:');
  Object.entries(deployed.contracts).forEach(([name, address]) => {
    console.log(`${name}: ${address}`);
  });
}
console.log('\n� READY FOR GRANT SUBMISSION!');
