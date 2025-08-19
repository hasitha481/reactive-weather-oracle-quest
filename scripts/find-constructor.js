import hre from 'hardhat';
const { ethers } = hre;
import fs from 'fs';

async function main() {
    console.log("🔍 Finding WeatherNFT constructor from compiled artifacts...");
    
    try {
        // Get the contract factory to examine its interface
        const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
        
        // Get constructor fragment from interface
        const constructorFragment = WeatherNFT.interface.fragments.find(
            fragment => fragment.type === 'constructor'
        );
        
        if (constructorFragment) {
            console.log("\n✅ Constructor found!");
            console.log("📋 Constructor signature:");
            console.log(constructorFragment.format());
            
            console.log("\n📝 Parameters:");
            constructorFragment.inputs.forEach((input, index) => {
                console.log(`   ${index + 1}. ${input.name}: ${input.type}`);
            });
            
            console.log(`\n🎯 Number of parameters: ${constructorFragment.inputs.length}`);
            
            // Generate example deployment call
            console.log("\n💡 Example deployment calls:");
            
            if (constructorFragment.inputs.length === 0) {
                console.log("   WeatherNFT.deploy()");
            } else {
                const exampleArgs = constructorFragment.inputs.map(input => {
                    switch (input.type) {
                        case 'address':
                            return input.name.includes('oracle') ? 
                                '"0x1Df5FF83103097FC44A0a4BC182c40ccE7341871"' : 
                                '"0x0000000000000000000000000000000000000000"';
                        case 'string':
                            return input.name.includes('name') ? '"WeatherNFT"' :
                                   input.name.includes('symbol') ? '"WNFT"' :
                                   '"DefaultString"';
                        case 'uint256':
                            return '1';
                        case 'bool':
                            return 'true';
                        default:
                            return `"${input.type}"`;
                    }
                });
                
                console.log(`   WeatherNFT.deploy(${exampleArgs.join(', ')})`);
            }
            
        } else {
            console.log("❌ No constructor found in interface!");
        }
        
        // Also check if there are any specific function signatures we should know about
        console.log("\n📋 Contract functions (first 10):");
        WeatherNFT.interface.fragments
            .filter(f => f.type === 'function')
            .slice(0, 10)
            .forEach(f => {
                console.log(`   ${f.name}(${f.inputs.map(i => `${i.type} ${i.name}`).join(', ')})`);
            });
            
    } catch (error) {
        console.error("❌ Error examining contract:", error.message);
        
        // Try to read the ABI file directly
        try {
            console.log("\n🔍 Trying to read compiled ABI directly...");
            const artifactPath = './artifacts/contracts/WeatherNFT.sol/WeatherNFT.json';
            
            if (fs.existsSync(artifactPath)) {
                const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
                const constructor = artifact.abi.find(item => item.type === 'constructor');
                
                if (constructor) {
                    console.log("✅ Constructor found in ABI:");
                    console.log("Parameters:", constructor.inputs.length);
                    constructor.inputs.forEach((input, i) => {
                        console.log(`   ${i + 1}. ${input.name}: ${input.type}`);
                    });
                } else {
                    console.log("❌ No constructor in ABI (using default)");
                }
            } else {
                console.log("❌ ABI file not found");
            }
        } catch (abiError) {
            console.log("❌ Could not read ABI file:", abiError.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });