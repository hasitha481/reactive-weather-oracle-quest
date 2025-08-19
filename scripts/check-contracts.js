import fs from 'fs';
import path from 'path';

async function checkContracts() {
    console.log("🔍 Checking available contracts and artifacts...");
    
    // Check contracts folder
    console.log("\n📁 Contracts in /contracts/ folder:");
    const contractsDir = './contracts';
    if (fs.existsSync(contractsDir)) {
        const files = fs.readdirSync(contractsDir).filter(f => f.endsWith('.sol'));
        files.forEach(file => {
            console.log(`   ✅ ${file}`);
        });
    }
    
    // Check artifacts folder
    console.log("\n🔨 Generated artifacts in /artifacts/contracts/:");
    const artifactsDir = './artifacts/contracts';
    if (fs.existsSync(artifactsDir)) {
        const contractDirs = fs.readdirSync(artifactsDir);
        contractDirs.forEach(dir => {
            if (fs.statSync(path.join(artifactsDir, dir)).isDirectory()) {
                console.log(`   ✅ ${dir}`);
                
                // Check for .json files in each contract dir
                const contractPath = path.join(artifactsDir, dir);
                const jsonFiles = fs.readdirSync(contractPath).filter(f => f.endsWith('.json') && !f.includes('.dbg.'));
                jsonFiles.forEach(json => {
                    console.log(`      📄 ${json}`);
                });
            }
        });
    } else {
        console.log("   ❌ No artifacts found - need to compile contracts");
    }
    
    // Check deployed addresses
    console.log("\n📋 Already deployed contracts:");
    if (fs.existsSync('./deployed-addresses.json')) {
        const deployed = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
        Object.entries(deployed).forEach(([name, address]) => {
            console.log(`   ✅ ${name}: ${address}`);
        });
    }
}

checkContracts().catch(console.error);