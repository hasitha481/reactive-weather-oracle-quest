import fs from 'fs';

async function updateFrontendConfig() {
    console.log("🔄 Updating frontend contract configuration...");
    
    // Read deployed addresses
    const deployedAddresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    
    // Read current frontend config
    const configPath = './frontend/src/contracts/contractConfig.js';
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update each contract address
    Object.keys(deployedAddresses).forEach(contractName => {
        const address = deployedAddresses[contractName];
        const regex = new RegExp(`${contractName}: ".*?"`, 'g');
        configContent = configContent.replace(regex, `${contractName}: "${address}"`);
    });
    
    // Write updated config
    fs.writeFileSync(configPath, configContent);
    
    console.log("✅ Frontend configuration updated!");
    console.log("📁 File:", configPath);
    
    // Display updated addresses
    console.log("\n📋 Updated Contract Addresses:");
    Object.entries(deployedAddresses).forEach(([name, address]) => {
        console.log(`   ${name}: ${address}`);
    });
}

updateFrontendConfig().catch(console.error);