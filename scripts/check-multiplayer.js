import pkg from 'hardhat';
const { ethers } = pkg;

async function checkMultiplayer() {
    console.log("🔍 Checking MultiplayerSync contract for issues");
    
    try {
        // Try to get the contract factory
        const MultiplayerSync = await ethers.getContractFactory("MultiplayerSync");
        console.log("✅ Contract factory created successfully");
        
        // Check if we can get the bytecode
        const bytecode = MultiplayerSync.bytecode;
        console.log("📦 Bytecode length:", bytecode.length);
        
        // Check constructor interface
        const fragment = MultiplayerSync.interface.deploy;
        console.log("🔧 Constructor inputs:", fragment.inputs.map(i => i.type));
        
        // Try to encode the constructor data
        const addresses = [
            "0x1df5ff83103097fc44a0a4bc182c40cce7341871",
            "0x3a832f200b441f86e366763f60d729797d5ae830", 
            "0xfcff86197876fa553d4dc54257e1bb66ef048972"
        ];
        
        const encodedData = MultiplayerSync.interface.encodeDeploy(addresses);
        console.log("📝 Constructor data encoded successfully");
        
        console.log("✅ MultiplayerSync contract appears to be valid");
        console.log("💡 The issue might be network-specific or gas-related");
        
    } catch (error) {
        console.error("❌ MultiplayerSync check failed:", error.message);
    }
}

checkMultiplayer().catch(console.error);