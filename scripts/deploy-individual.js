import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

// Deploy specific contracts individually
async function deployContract(contractName, constructorArgs = []) {
    console.log(`🎯 Deploying ${contractName}...`);
    
    const [deployer] = await ethers.getSigners();
    
    try {
        const ContractFactory = await ethers.getContractFactory(contractName);
        
        const contract = await ContractFactory.deploy(...constructorArgs, {
            gasLimit: 250000,
            gasPrice: ethers.parseUnits("0.5", "gwei")
        });
        
        await contract.waitForDeployment();
        const address = await contract.getAddress();
        
        console.log(`✅ ${contractName} deployed to: ${address}`);
        
        // Save to deployed addresses
        let addresses = {};
        if (fs.existsSync('./deployed-addresses.json')) {
            addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
        }
        
        addresses[contractName] = address;
        fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
        
        return address;
        
    } catch (error) {
        console.log(`❌ Failed to deploy ${contractName}: ${error.message}`);
        return null;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const contractName = args[0];
    
    if (!contractName) {
        console.log("Usage: npx hardhat run scripts/deploy-individual.js --network somniaTestnet CONTRACT_NAME");
        console.log("Available contracts: QuestManager, MultiplayerSync, WeatherOracle, WeatherToken, WeatherNFT");
        return;
    }
    
    // Load existing addresses for constructor args
    let addresses = {};
    if (fs.existsSync('./deployed-addresses.json')) {
        addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
    }
    
    // Define constructor arguments for each contract
    const contractArgs = {
        QuestManager: [
            addresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
            addresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830"
        ],
        MultiplayerSync: [
            addresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871", 
            addresses.QuestManager || "0x0000000000000000000000000000000000000000", // Deploy QuestManager first
            addresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830"
        ]
    };
    
    const args = contractArgs[contractName] || [];
    await deployContract(contractName, args);
}

main().catch(console.error);