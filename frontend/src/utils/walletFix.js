// FILE: frontend/src/utils/walletFix.js
// MetaMask Detection Fix

export const detectMetaMask = () => {
  // Check for MetaMask
  if (typeof window.ethereum !== 'undefined') {
    console.log('✅ MetaMask detected!');
    return window.ethereum;
  }
  
  // Check for legacy web3
  if (typeof window.web3 !== 'undefined') {
    console.log('✅ Legacy Web3 detected!');
    return window.web3.currentProvider;
  }
  
  console.log('❌ No Ethereum provider found');
  return null;
};

export const requestMetaMaskAccess = async () => {
  const provider = detectMetaMask();
  if (!provider) {
    throw new Error('MetaMask not installed. Please install MetaMask extension.');
  }
  
  try {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    console.log('✅ MetaMask connected:', accounts[0]);
    return { provider, accounts };
  } catch (error) {
    console.error('❌ MetaMask connection failed:', error);
    throw error;
  }
};
