const { ethers } = require("hardhat");

async function main() {
  console.log("🎨 Deploying Simple WeatherNFT Contract...");

  const SimpleWeatherNFT = await ethers.getContractFactory("SimpleWeatherNFT");
  const nft = await SimpleWeatherNFT.deploy({
    gasLimit: 1500000 // Much lower gas limit
  });
  
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();

  console.log("✅ Simple WeatherNFT deployed to:", nftAddress);
  
  // Test mint
  const [deployer] = await ethers.getSigners();
  const mintTx = await nft.mint(deployer.address, { gasLimit: 100000 });
  await mintTx.wait();
  
  console.log("✅ Test NFT minted!");
  console.log("🎯 Contract Address:", nftAddress);
}

main().catch(console.error);