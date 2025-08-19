import hre from 'hardhat';
const { ethers } = hre;

async function main() {
    console.log("🔍 Testing WeatherNFT constructor patterns...");
    
    const [deployer] = await ethers.getSigners();
    const weatherOracleAddress = "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871";
    
    const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
    
    // Test different constructor patterns
    const testPatterns = [
        {
            name: "No parameters",
            args: [],
            test: () => WeatherNFT.deploy()
        },
        {
            name: "Only oracle address",
            args: [weatherOracleAddress],
            test: () => WeatherNFT.deploy(weatherOracleAddress)
        },
        {
            name: "ERC721 standard (name, symbol)",
            args: ["WeatherNFT", "WNFT"],
            test: () => WeatherNFT.deploy("WeatherNFT", "WNFT")
        },
        {
            name: "Oracle + ERC721 (oracle, name, symbol)",
            args: [weatherOracleAddress, "WeatherNFT", "WNFT"],
            test: () => WeatherNFT.deploy(weatherOracleAddress, "WeatherNFT", "WNFT")
        },
        {
            name: "Full parameters (name, symbol, oracle)",
            args: ["WeatherNFT", "WNFT", weatherOracleAddress],
            test: () => WeatherNFT.deploy("WeatherNFT", "WNFT", weatherOracleAddress)
        }
    ];
    
    for (const pattern of testPatterns) {
        try {
            console.log(`\n🧪 Testing: ${pattern.name}`);
            console.log(`   Args: [${pattern.args.join(', ')}]`);
            
            // Just estimate gas to test if constructor is valid
            const gasEstimate = await pattern.test().estimateGas();
            console.log(`✅ VALID! Gas estimate: ${gasEstimate.toString()}`);
            console.log(`🎯 Correct constructor found: ${pattern.name}`);
            console.log(`📝 Use this in deployment: WeatherNFT.deploy(${pattern.args.join(', ')})`);
            break;
            
        } catch (error) {
            console.log(`❌ Invalid: ${error.message.split('\n')[0]}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });