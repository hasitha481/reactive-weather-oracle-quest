import { ethers } from "ethers";
import { deployedAddresses } from "../contracts/contractConfig";

export const forceContractConnection = async (signer) => {
  console.log("Ì¥Ñ Force connecting contracts...");
  try {
    const contracts = {};
    const testABI = ["function name() view returns (string)"];
    for (const [name, address] of Object.entries(deployedAddresses)) {
      try {
        contracts[name.toLowerCase()] = new ethers.Contract(address, testABI, signer);
        console.log(`‚úÖ ${name} connected:`, address);
      } catch (error) {
        console.log(`‚ùå ${name} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error("Contract connection failed:", error);
    return {};
  }
};
