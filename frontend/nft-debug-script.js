// NFT Minting Debug Script
// Run this to diagnose the exact NFT minting issue

const { ethers } = require('ethers');

async function debugNFTMinting() {
  console.log('🎨 DEBUG: NFT Minting Analysis');
  
  try {
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network');
    const network = await provider.getNetwork();
    console.log(`📡 Connected to network: ${network.name} Chain ID: ${network.chainId}`);

    // Contract address from your deployment
    const nftAddress = "0xFCfF86197876fA553d4dC54257E1bB66Ef048972";
    
    // Extended NFT ABI to check all functions
    const nftABI = [
      "function mintWeatherNFT(uint8 category) external payable",
      "function mint(uint8 category) external payable", // Alternative function name
      "function mintPrice() view returns (uint256)",
      "function maxSupply() view returns (uint256)",
      "function totalMinted() view returns (uint256)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address owner) view returns (uint256)",
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function owner() view returns (address)",
      "function paused() view returns (bool)",
      "event NFTMinted(uint256 indexed tokenId, address indexed owner, uint8 category, uint8 rarity)"
    ];

    const nftContract = new ethers.Contract(nftAddress, nftABI, provider);

    console.log('\n🎨 === NFT CONTRACT ANALYSIS ===');
    
    // Basic contract info
    try {
      const name = await nftContract.name();
      const symbol = await nftContract.symbol();
      console.log(`✅ Contract Name: ${name}`);
      console.log(`✅ Contract Symbol: ${symbol}`);
    } catch (error) {
      console.log(`❌ Basic info failed: ${error.message}`);
    }

    // Check mint price
    try {
      const mintPrice = await nftContract.mintPrice();
      console.log(`💰 Current mint price: ${ethers.formatEther(mintPrice)} STT`);
    } catch (error) {
      console.log(`❌ Mint price check failed: ${error.message}`);
    }

    // Check supply info
    try {
      const totalMinted = await nftContract.totalMinted();
      const maxSupply = await nftContract.maxSupply();
      console.log(`📊 Total minted: ${totalMinted.toString()}`);
      console.log(`📊 Max supply: ${maxSupply.toString()}`);
      console.log(`📊 Available to mint: ${(maxSupply - totalMinted).toString()}`);
    } catch (error) {
      console.log(`❌ Supply check failed: ${error.message}`);
    }

    // Check if contract is paused
    try {
      const isPaused = await nftContract.paused();
      console.log(`⏸️ Contract paused: ${isPaused}`);
    } catch (error) {
      console.log(`⚠️ Pause status unknown: ${error.message}`);
    }

    // Check owner
    try {
      const owner = await nftContract.owner();
      console.log(`👤 Contract owner: ${owner}`);
    } catch (error) {
      console.log(`⚠️ Owner check failed: ${error.message}`);
    }

    console.log('\n🔧 === FUNCTION SIGNATURE CHECK ===');
    
    // Try to get function selectors to see which functions exist
    try {
      // This will help us identify the correct function name
      const fragment1 = ethers.id("mintWeatherNFT(uint8)").slice(0, 10);
      const fragment2 = ethers.id("mint(uint8)").slice(0, 10);
      const fragment3 = ethers.id("mintWeatherNFT(uint8,uint256)").slice(0, 10);
      
      console.log(`🔍 mintWeatherNFT(uint8) selector: ${fragment1}`);
      console.log(`🔍 mint(uint8) selector: ${fragment2}`);
      console.log(`🔍 mintWeatherNFT(uint8,uint256) selector: ${fragment3}`);
    } catch (error) {
      console.log(`❌ Function selector analysis failed: ${error.message}`);
    }

    console.log('\n💡 === RECOMMENDED FIXES ===');
    console.log('1. Check if contract is paused');
    console.log('2. Verify mint price matches payment');
    console.log('3. Ensure max supply not reached');
    console.log('4. Check function signature matches contract');
    console.log('5. Verify category parameter is valid (0-4)');
    
    console.log('\n🎯 Run this script and share the output to identify the exact issue!');

  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  }
}

debugNFTMinting();