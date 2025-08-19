import hre from 'hardhat';
const { ethers } = hre;
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🚀 Ultra low gas deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", await deployer.getAddress());
    
    let balance = await ethers.provider.getBalance(deployer.address);
    console.log("Starting balance:", ethers.formatEther(balance), "STT");

    const deployedAddresses = {
        WeatherOracle: "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
        WeatherToken: "0x3A832f200b441f86E366763F60d729797D5ae830", 
        WeatherNFT: "0xFCfF86197876fA553d4dC54257E1bB66Ef048972"
    };

    try {
        console.log("\n✅ Using deployed contracts:");
        console.log("   WeatherOracle:", deployedAddresses.WeatherOracle);
        console.log("   WeatherToken:", deployedAddresses.WeatherToken);
        console.log("   WeatherNFT:", deployedAddresses.WeatherNFT);

        // Check what contracts are available for compilation
        console.log("\n🔍 Checking available contracts...");
        try {
            // Try different contract names that might exist
            const possibleContracts = [
                "QuestManager", 
                "SimpleQuestManager", 
                "WeatherQuestManager",
                "QuestSystem",
                "SimpleWeatherOracle",
                "SimpleWeatherToken",
                "SimpleWeatherNFT"
            ];
            
            for (const contractName of possibleContracts) {
                try {
                    const factory = await ethers.getContractFactory(contractName);
                    console.log(`✅ Found contract: ${contractName}`);
                    
                    // If it's a quest manager type, try to deploy with minimal gas
                    if (contractName.toLowerCase().includes('quest')) {
                        console.log(`\n🎯 Attempting to deploy ${contractName} with ultra-low gas...`);
                        
                        // Try to get constructor info first
                        const constructorFragment = factory.interface.fragments.find(
                            fragment => fragment.type === 'constructor'
                        );
                        
                        if (constructorFragment) {
                            console.log(`Constructor parameters: ${constructorFragment.inputs.length}`);
                            constructorFragment.inputs.forEach((input, i) => {
                                console.log(`   ${i + 1}. ${input.name}: ${input.type}`);
                            });
                        }
                        
                        // Try deployment with different parameter combinations
                        let deployed = false;
                        
                        // Pattern 1: Three addresses (oracle, token, nft)
                        if (!deployed && constructorFragment.inputs.length === 3) {
                            try {
                                console.log("Trying 3-parameter deployment...");
                                const contract = await factory.deploy(
                                    deployedAddresses.WeatherOracle,
                                    deployedAddresses.WeatherToken,
                                    deployedAddresses.WeatherNFT,
                                    { gasLimit: 80000 } // Very low gas
                                );
                                await contract.waitForDeployment();
                                const address = await contract.getAddress();
                                console.log(`✅ ${contractName} deployed to:`, address);
                                deployedAddresses.QuestManager = address;
                                deployed = true;
                            } catch (e) {
                                console.log(`❌ 3-param failed: ${e.message.split('\n')[0]}`);
                            }
                        }
                        
                        // Pattern 2: No parameters
                        if (!deployed && constructorFragment.inputs.length === 0) {
                            try {
                                console.log("Trying no-parameter deployment...");
                                const contract = await factory.deploy({
                                    gasLimit: 50000 // Very low gas
                                });
                                await contract.waitForDeployment();
                                const address = await contract.getAddress();
                                console.log(`✅ ${contractName} deployed to:`, address);
                                deployedAddresses.QuestManager = address;
                                deployed = true;
                            } catch (e) {
                                console.log(`❌ No-param failed: ${e.message.split('\n')[0]}`);
                            }
                        }
                        
                        if (deployed) break;
                    }
                } catch (error) {
                    // Contract doesn't exist, continue
                }
            }
            
        } catch (error) {
            console.log("❌ Error checking contracts:", error.message);
        }

        // Final balance check
        balance = await ethers.provider.getBalance(deployer.address);
        console.log("\nFinal balance:", ethers.formatEther(balance), "STT");
        console.log("Total gas used:", ethers.formatEther(0.904975748 - parseFloat(ethers.formatEther(balance))), "STT");

        // Save current progress
        await saveProgress(deployedAddresses);

        console.log("\n🎉 CURRENT STATUS:");
        console.log("📋 Deployed Contracts:");
        Object.entries(deployedAddresses).forEach(([name, address]) => {
            console.log(`   ✅ ${name}: ${address}`);
        });
        
        if (!deployedAddresses.QuestManager) {
            console.log("\n💡 No QuestManager deployed yet.");
            console.log("   You have 3 working contracts ready for frontend integration!");
            console.log("   QuestManager can be deployed later with more STT.");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
        await saveProgress(deployedAddresses);
    }
}

async function saveProgress(deployedAddresses) {
    try {
        const addressesPath = path.join(__dirname, "../deployed-addresses.json");
        fs.writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));

        const contractConfigPath = path.join(__dirname, "../frontend/src/contracts/contractConfig.js");
        const contractConfigContent = `// Final deployed contracts
// Updated: ${new Date().toISOString()}

export const SOMNIA_TESTNET = {
  chainId: 50312,
  name: 'Somnia Testnet',
  rpcUrl: 'https://dream-rpc.somnia.network',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  blockExplorer: 'https://shannon-explorer.somnia.network'
};

export const deployedAddresses = {
  WeatherOracle: "${deployedAddresses.WeatherOracle}",
  WeatherToken: "${deployedAddresses.WeatherToken}",
  WeatherNFT: "${deployedAddresses.WeatherNFT}",
  QuestManager: "${deployedAddresses.QuestManager || '0x0000000000000000000000000000000000000000'}"
};

export const CONTRACT_ADDRESSES = deployedAddresses;

export const WEATHER_ORACLE_ABI = [
  "function getWeather(uint256 zoneId) view returns (uint8)",
  "function setWeather(uint256 zoneId, uint8 weatherType)"
];

export const WEATHER_NFT_ABI = [
  "function mint(address to, uint256 category) payable returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

export const WEATHER_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

export const WEATHER_TYPES = {
  0: 'Clear', 1: 'Sunny', 2: 'Rainy', 3: 'Stormy', 4: 'Foggy', 5: 'Snowy'
};

export const NFT_CATEGORIES = {
  0: 'Storm Gear', 1: 'Weather Collectible', 2: 'Ancient Artifact', 3: 'Elemental Weapon', 4: 'Weather Tool'
};

export const DEPLOYMENT_STATUS = {
  isDeployed: true,
  lastUpdated: "${new Date().toISOString()}",
  network: 'somniaTestnet',
  coreContracts: ${Object.keys(deployedAddresses).length}
};`;

        fs.writeFileSync(contractConfigPath, contractConfigContent);
        console.log("✅ Progress saved");

    } catch (error) {
        console.error("Error saving:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });