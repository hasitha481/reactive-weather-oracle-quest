import pkg from 'hardhat';
const { ethers } = pkg;

async function checkBalance() {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Current balance:", ethers.formatEther(balance), "STT");
    
    if (parseFloat(ethers.formatEther(balance)) < 0.05) {
        console.log("⚠️  Need more STT for MultiplayerSync deployment");
        console.log("🌐 Get more from: https://faucet.somnia.network");
    } else {
        console.log("✅ Sufficient balance for MultiplayerSync");
    }
}
checkBalance();