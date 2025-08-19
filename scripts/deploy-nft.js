const { ethers } = require("hardhat");

async function main() {
  console.log("🎨 Deploying WeatherNFT Contract...");

  // Get the WeatherOracle address (replace with your deployed address)
  const WEATHER_ORACLE_ADDRESS = "0x66c51f5b9778B59637a4BC4C39c6509898560BC3";

  // Get deployer and provider for gas estimation
  const [deployer] = await ethers.getSigners();
  const provider = deployer.provider;
  
  // Get current gas price and add buffer
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice ? (feeData.gasPrice * 120n) / 100n : ethers.parseUnits("20", "gwei"); // 20% buffer or 20 gwei fallback
  
  console.log("🔧 Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  // Deploy WeatherNFT
  const WeatherNFT = await ethers.getContractFactory("WeatherNFT");
  const weatherNFT = await WeatherNFT.deploy(WEATHER_ORACLE_ADDRESS, {
    gasPrice: gasPrice,
    gasLimit: 5000000
  });
  
  await weatherNFT.waitForDeployment();
  const nftAddress = await weatherNFT.getAddress();

  console.log("✅ WeatherNFT deployed to:", nftAddress);
  
  // Test minting an NFT
  console.log("🎭 Testing NFT minting...");
  
  // Mint a Storm Gear NFT in zone 0
  const mintTx = await weatherNFT.mintWeatherNFT(
    deployer.address,
    0, // NFTCategory.GEAR
    0, // Central Plains zone
    {
      gasPrice: gasPrice,
      gasLimit: 300000
    }
  );
  
  await mintTx.wait();
  console.log("✅ Test NFT minted successfully!");

  // Get NFT metadata
  const tokenURI = await weatherNFT.tokenURI(0);
  console.log("🎨 NFT Metadata:", tokenURI);

  console.log("\n🎯 Contract Addresses:");
  console.log("WeatherOracle:", WEATHER_ORACLE_ADDRESS);
  console.log("WeatherNFT:", nftAddress);
  
  console.log("\n📋 Next Steps:");
  console.log("1. Update frontend with new NFT contract address:", nftAddress);
  console.log("2. Add NFT inventory component");
  console.log("3. Test weather updates affecting NFTs");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });