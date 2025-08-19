import hre from 'hardhat';
const { ethers } = hre;

async function main() {
    console.log("🔍 Testing WeatherNFT constructor directly...");
    
    const weatherOracleAddress = "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871";
    const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
    
    // Get the contract interface to examine constructor
    console.log("📋 Contract interface info:");
    console.log("Contract name:", WeatherNFT.interface.fragments.length, "functions");
    
    // Test patterns one by one with actual deployment attempts
    const testPatterns = [
        { name: "No parameters", deploy: () => WeatherNFT.deploy() },
        { name: "Oracle only", deploy: () => WeatherNFT.deploy(weatherOracleAddress) },
        { name: "ERC721 (name, symbol)", deploy: () => WeatherNFT.deploy("WeatherNFT", "WNFT") },
        { name: "Oracle + ERC721", deploy: () => WeatherNFT.deploy(weatherOracleAddress, "WeatherNFT", "WNFT") }
    ];
    
    for (const pattern of testPatterns) {
        try {
            console.log(`\n🧪 Testing: ${pattern.name}`);
            
            // Try to deploy with ultra-low gas to test constructor
            const contract = await pattern.deploy();
            console.log(`✅ SUCCESS! Constructor pattern: ${pattern.name}`);
            console.log(`🎯 This is the correct pattern to use!`);
            
            // Don't wait for deployment, just test if it starts
            break;
            
        } catch (error) {
            if (error.message.includes("incorrect number of arguments")) {
                console.log(`❌ Wrong arguments: ${pattern.name}`);
            } else if (error.message.includes("insufficient")) {
                console.log(`⚠️ Insufficient balance, but constructor is VALID: ${pattern.name}`);
                console.log(`🎯 This is the correct pattern!`);
                break;
            } else {
                console.log(`❌ Other error: ${error.message.split('\n')[0]}`);
            }
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });