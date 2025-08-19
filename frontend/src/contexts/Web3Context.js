import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Import contract configurations
import {
  deployedAddresses,
  WEATHER_ORACLE_ABI,
  QUEST_MANAGER_ABI, 
  WEATHER_NFT_ABI,
  WEATHER_TOKEN_ABI,
  SOMNIA_TESTNET
} from '../contracts/contractConfig';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState({});
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);

  // Initialize contracts with error handling
  const initializeContracts = useCallback(async (signer) => {
    try {
      // Only initialize contracts with valid addresses
      const contractInstances = {};
      
      if (deployedAddresses.WeatherOracle && deployedAddresses.WeatherOracle !== '0x0000000000000000000000000000000000000000') {
        contractInstances.weatherOracle = new ethers.Contract(
          deployedAddresses.WeatherOracle,
          WEATHER_ORACLE_ABI,
          signer
        );
      }

      if (deployedAddresses.WeatherToken && deployedAddresses.WeatherToken !== '0x0000000000000000000000000000000000000000') {
        contractInstances.weatherToken = new ethers.Contract(
          deployedAddresses.WeatherToken,
          WEATHER_TOKEN_ABI,
          signer
        );
      }

      if (deployedAddresses.WeatherNFT && deployedAddresses.WeatherNFT !== '0x0000000000000000000000000000000000000000') {
        contractInstances.weatherNFT = new ethers.Contract(
          deployedAddresses.WeatherNFT,
          WEATHER_NFT_ABI,
          signer
        );
      }

      if (deployedAddresses.QuestManager && deployedAddresses.QuestManager !== '0x0000000000000000000000000000000000000000') {
        contractInstances.questManager = new ethers.Contract(
          deployedAddresses.QuestManager,
          QUEST_MANAGER_ABI,
          signer
        );
      }

      setContracts(contractInstances);
      return contractInstances;
    } catch (error) {
      console.error('Error initializing contracts:', error);
      toast.error('Failed to initialize contracts');
      return {};
    }
  }, []);

  // Connect wallet function with improved error handling
  const connectWallet = useCallback(async () => {
    setLoading(true);
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      // Clear any existing ethereum provider errors
      if (window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners();
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer using Ethers v6 syntax
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const network = await browserProvider.getNetwork();

      setProvider(browserProvider);
      setSigner(signer);
      setAccount(address);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Get balance
      const balance = await browserProvider.getBalance(address);
      setBalance(ethers.formatEther(balance));

      // Check if on correct network
      if (Number(network.chainId) !== SOMNIA_TESTNET.chainId) {
        await switchToSomniaNetwork();
      }

      // Initialize contracts
      await initializeContracts(signer);

      toast.success('Wallet connected successfully!');
      console.log('Connected to:', address);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [initializeContracts]);

  // Switch to Somnia network
  const switchToSomniaNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SOMNIA_TESTNET.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${SOMNIA_TESTNET.chainId.toString(16)}`,
            chainName: SOMNIA_TESTNET.name,
            rpcUrls: [SOMNIA_TESTNET.rpcUrl],
            nativeCurrency: SOMNIA_TESTNET.nativeCurrency,
            blockExplorerUrls: [SOMNIA_TESTNET.blockExplorer]
          }]
        });
      } else {
        throw switchError;
      }
    }
  };

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContracts({});
    setChainId(null);
    setBalance('0');
    setIsConnected(false);
    toast.success('Wallet disconnected');
  }, []);

  // Auto-connect on load with error handling
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
          // Don't show error toast for auto-connect failures
        }
      }
    };

    autoConnect();
  }, [connectWallet]);

  // Listen for account changes with error handling
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        try {
          if (accounts.length === 0) {
            disconnect();
          } else {
            connectWallet();
          }
        } catch (error) {
          console.error('Error handling account change:', error);
        }
      };

      const handleChainChanged = () => {
        try {
          window.location.reload();
        } catch (error) {
          console.error('Error handling chain change:', error);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [connectWallet, disconnect]);

  const value = {
    account,
    provider,
    signer,
    contracts,
    loading,
    chainId,
    balance,
    isConnected,
    connectWallet,
    disconnect,
    switchToSomniaNetwork,
    initializeContracts
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};