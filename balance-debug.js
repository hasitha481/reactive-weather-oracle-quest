// FILE: balance-debug.js
// Copy this into browser console (F12) to debug balance issues

console.log('🛠️ Loading Somnia Balance Debug Tools...');

const SOMNIA_CONFIG = {
  chainId: 50312,
  chainIdHex: '0xc488',
  name: 'Somnia Testnet',
  rpcUrl: 'https://dream-rpc.somnia.network',
  blockExplorer: 'https://shannon-explorer.somnia.network'
};

// Debug function 1: Check MetaMask network
window.checkMetaMaskNetwork = async function() {
  console.log('🔍 Checking MetaMask network...');
  
  if (!window.ethereum) {
    console.log('❌ MetaMask not found');
    return false;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log(`Current Chain ID: ${chainId}`);
    console.log(`Expected Chain ID: ${SOMNIA_CONFIG.chainIdHex}`);
    
    if (chainId === SOMNIA_CONFIG.chainIdHex) {
      console.log('✅ Correct network (Somnia Testnet)');
      return true;
    } else {
      console.log('❌ Wrong network! Switching to Somnia...');
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SOMNIA_CONFIG.chainIdHex }],
        });
        console.log('✅ Switched to Somnia Network');
        return true;
      } catch (switchError) {
        if (switchError.code === 4902) {
          console.log('📝 Adding Somnia Network...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SOMNIA_CONFIG.chainIdHex,
              chainName: SOMNIA_CONFIG.name,
              rpcUrls: [SOMNIA_CONFIG.rpcUrl],
              nativeCurrency: {
                name: 'STT',
                symbol: 'STT',
                decimals: 18
              },
              blockExplorerUrls: [SOMNIA_CONFIG.blockExplorer]
            }],
          });
          console.log('✅ Somnia Network added and switched');
          return true;
        } else {
          console.error('❌ Failed to switch network:', switchError);
          return false;
        }
      }
    }
  } catch (error) {
    console.error('❌ Network check failed:', error);
    return false;
  }
};

// Debug function 2: Quick balance check
window.quickBalanceCheck = async function() {
  console.log('💰 Quick Balance Check Starting...');
  
  const networkOK = await window.checkMetaMaskNetwork();
  if (!networkOK) {
    console.log('❌ Network setup failed');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.log('❌ No accounts connected. Requesting connection...');
      const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (newAccounts.length === 0) {
        console.log('❌ User rejected connection');
        return;
      }
    }

    const account = accounts[0];
    console.log(`🏦 Checking balance for: ${account}`);

    // Try with ethers if available
    if (typeof ethers !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      const balanceSTT = ethers.formatEther(balance);
      
      console.log(`✅ Balance via ethers: ${balanceSTT} STT`);
      return balanceSTT;
    } else {
      // Fallback to raw RPC call
      const result = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      const balanceWei = parseInt(result, 16);
      const balanceSTT = (balanceWei / Math.pow(10, 18)).toFixed(6);
      
      console.log(`✅ Balance via RPC: ${balanceSTT} STT`);
      return balanceSTT;
    }
  } catch (error) {
    console.error('❌ Balance check failed:', error);
    return null;
  }
};

// Debug function 3: Full diagnosis
window.diagnoseBalanceIssue = async function() {
  console.log('🔧 Starting full balance diagnosis...\n');
  
  console.log('Step 1: Checking network...');
  const networkOK = await window.checkMetaMaskNetwork();
  if (!networkOK) {
    console.log('❌ Network issue - fix network first');
    return;
  }
  
  console.log('\nStep 2: Checking balance...');
  const balance = await window.quickBalanceCheck();
  
  if (balance && parseFloat(balance) > 0) {
    console.log(`\n✅ SUCCESS! Your balance is ${balance} STT`);
    console.log('If your app still shows 0, the issue is in the React component.');
  } else if (balance === '0.000000') {
    console.log('\n❌ Balance is 0 STT');
    console.log('Your address may not be funded on Somnia Testnet');
  } else {
    console.log('\n❌ Could not retrieve balance');
  }
};

console.log('✅ Debug functions loaded!');
console.log('\nRun: diagnoseBalanceIssue() to start');