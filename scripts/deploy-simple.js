import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 Simple one-by-one contract deployment");
    
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 STT Balance:", ethers.formatEther(balance));
    
    // Load existing addresses
    let addresses = {};
    if (fs.existsSync('./deployed-addresses.json')) {
        addresses = JSON.parse(fs.readFileSync('./deployed-addresses.json', 'utf8'));
        console.log("📋 Existing contracts:", Object.keys(addresses));
    }

    // Try to deploy contracts one by one
    const contractsToDeploy = [
        {
            name: "QuestManager",
            args: [
                addresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
                addresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830"
            ]
        },
        {
            name: "MultiplayerSync", 
            args: [
                addresses.WeatherOracle || "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
                null, // Will be filled with QuestManager address
                addresses.WeatherToken || "0x3A832f200b441f86E366763f60d729797D5ae830"
            ]
        }
    ];

    for (const contractInfo of contractsToDeploy) {
        try {
            console.log(`\n🎯 Attempting to deploy ${contractInfo.name}...`);
            
            // Check if contract factory exists
            let ContractFactory;
            try {
                ContractFactory = await ethers.getContractFactory(contractInfo.name);
            } catch (error) {
                console.log(`❌ Cannot find ${contractInfo.name} - skipping`);
                console.log(`   Error: ${error.message}`);
                continue;
            }
            
            // Prepare arguments
            let args = contractInfo.args;
            if (contractInfo.name === "MultiplayerSync" && addresses.QuestManager) {
                args[1] = addresses.QuestManager; // Use newly deployed QuestManager
            }
            
            console.log(`📝 Deploying with args:`, args);
            
            // Deploy with minimal gas
            const contract = await ContractFactory.deploy(...args, {
                gasLimit: 200000,
                gasPrice: ethers.parseUnits("0.5", "gwei") // Slightly higher for reliability
            });
            
            await contract.waitForDeployment();
            const contractAddress = await contract.getAddress();
            
            console.log(`✅ ${contractInfo.name} deployed to: ${contractAddress}`);
            
            // Save address
            addresses[contractInfo.name] = contractAddress;
            fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
            
        } catch (error) {
            console.log(`❌ Failed to deploy ${contractInfo.name}:`);
            console.log(`   ${error.message}`);
            
            if (error.message.includes("insufficient funds")) {
                console.log("💡 Need more STT from faucet");
                break;
            }
        }
    }
    
    console.log("\n🎉 Deployment complete!");
    console.log("📄 Final addresses:", addresses);
}

main().catch(console.error);