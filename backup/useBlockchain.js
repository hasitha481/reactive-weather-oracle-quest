// FILE: frontend/src/hooks/useBlockchain.js
// BULLETPROOF VERSION - Zero circular dependencies, no infinite loops

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { NETWORK_CONFIG, deployedAddresses, WEATHER_TYPES } from '../contracts/contractConfig';

// CORRECTED Contract ABIs - Updated to match deployed contracts
const WEATHER_ORACLE_ABI = [
  "function getCurrentWeather(uint256 zone) view returns (tuple(uint8 weatherType, uint256 intensity, uint256 startTime, uint256 duration, uint256 zone, bool isActive, uint256 rarityBonus))",
  "function getAllWeather() view returns (tuple(uint8 weatherType, uint256 intensity, uint256 startTime, uint256 duration, uint256 zone, bool isActive, uint256 rarityBonus)[5])",
  "function changeWeather(uint256 zone, uint8 weatherType, uint256 intensity) external",
  "function updatePlayerExposure(address player, uint256 zone) external",
  "function getPlayerExposure(address player) view returns (uint256)",
  "function startCommunityVote(uint256 zone) external",
  "function voteForWeather(uint256 zone, uint8 weatherType) external",
  "function finalizeVote(uint256 zone) external",
  "function getVotingInfo(uint256 zone) view returns (bool active, uint256 endTime, uint256[8] weatherVotes)",
  "event WeatherChanged(uint256 indexed zone, uint8 newWeather, uint256 intensity, uint256 timestamp)",
  "event CommunityVoteStarted(uint256 indexed zone, uint256 endTime)",
  "event WeatherVoteCast(address indexed voter, uint256 indexed zone, uint8 weatherType)"
];

const WEATHER_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

const QUEST_MANAGER_ABI = [
  "function getAvailableQuests() view returns (uint256[])",
  "function getAllQuests() view returns (uint256[])",
  "function startQuest(uint256 questId) external",
  "function completeQuest(uint256 questId) external",
  "function getQuestDetails(uint256 questId) view returns (uint8 requiredWeather, uint256 reward, uint256 difficulty, bool active, uint256 completions, string description)",
  "function getPlayerStats(address player) view returns (uint256 totalQuests, uint256 totalXP, uint256[] completedQuestIds)",
  "function isQuestStarted(address player, uint256 questId) view returns (bool)",
  "function isQuestCompleted(address player, uint256 questId) view returns (bool)",
  "function getCurrentWeather() view returns (uint8)",
  "function updateWeather(uint8 newWeather) external",
  "function createQuest(uint8 requiredWeather, uint256 reward, uint256 difficulty, string description) external",
  "function toggleQuestActive(uint256 questId) external",
  "function getTotalQuests() view returns (uint256)",
  "function getContractBalance() view returns (uint256)",
  "function fundContract(uint256 amount) external",
  "event QuestCreated(uint256 indexed questId, uint8 requiredWeather, uint256 reward)",
  "event QuestCompleted(address indexed player, uint256 indexed questId, uint256 reward)",
  "event QuestStarted(address indexed player, uint256 indexed questId, uint8 weather)",
  "event WeatherUpdated(uint8 newWeather)"
];

const WEATHER_NFT_ABI = [
  "function mintWeatherNFT(uint8 category) external payable",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function getNFTMetadata(uint256 tokenId) view returns (uint8 category, uint8 rarity, uint256 weatherExposure, uint256 evolutionStage, uint256 questsCompleted, uint256 stakingPower, bool isAnimated)",
  "function getUserNFTs(address user) view returns (uint256[])",
  "function canEvolve(uint256 tokenId) view returns (bool)",
  "function evolveNFT(uint256 tokenId) external payable",
  "function recordWeatherExposure(uint256 tokenId, uint256 weatherType) external",
  "function recordQuestCompletion(uint256 tokenId, uint256 difficulty) external",
  "function getEvolutionRequirements(uint256 rarityLevel) view returns (uint256 minWeatherExposure, uint256 minQuestCount, uint256 timeRequired, bool requiresSpecialWeather)",
  "function mintPrice() view returns (uint256)",
  "function evolutionFee() view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "event NFTMinted(uint256 indexed tokenId, address indexed owner, uint8 category, uint8 rarity)",
  "event NFTEvolved(uint256 indexed tokenId, uint8 oldRarity, uint8 newRarity, uint256 newStakingPower)",
  "event WeatherExposureGained(uint256 indexed tokenId, uint256 weatherType, uint256 newExposureCount)"
];

const MULTIPLAYER_SYNC_ABI = [
  "function joinSession(uint256 sessionId) external",
  "function leaveSession() external",
  "function createSession(string name, uint256 maxPlayers) external",
  "function getCurrentSession(address player) view returns (uint256)",
  "function getSessionInfo(uint256 sessionId) view returns (string name, uint256 playerCount, uint256 maxPlayers, bool active)",      
  "function getSessionPlayers(uint256 sessionId) view returns (address[])",
  "function syncPlayerAction(uint256 actionType, uint256 data) external",
  "function getPlayerActions(address player) view returns (uint256[] actionTypes, uint256[] actionData, uint256[] timestamps)",       
  "event SessionCreated(uint256 indexed sessionId, address indexed creator, string name)",
  "event PlayerJoined(uint256 indexed sessionId, address indexed player)",
  "event PlayerLeft(uint256 indexed sessionId, address indexed player)",
  "event ActionSynced(address indexed player, uint256 actionType, uint256 data, uint256 timestamp)"
];

export const useBlockchain = () => {
  // State management
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0.000000');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [currentWeather, setCurrentWeather] = useState('Sunshine');
  const [contracts, setContracts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Switch to Somnia Network - STANDALONE FUNCTION
  const switchToSomniaNetwork = async () => {
    try {
      console.log('🔄 Switching to Somnia network');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        console.log('📝 Adding Somnia network');
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: NETWORK_CONFIG.chainIdHex,
              chainName: NETWORK_CONFIG.name,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              nativeCurrency: NETWORK_CONFIG.nativeCurrency,
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorer]
            }],
          });
        } catch (addError) {
          throw new Error('Failed to add Somnia network');
        }
      } else {
        throw switchError;
      }
    }
  };

  // Initialize smart contracts - STANDALONE FUNCTION
  const initializeContracts = async (signerInstance) => {
    try {
      console.log('📋 Initializing contracts');

      const contractInstances = {};

      // Initialize contracts with error handling but no console spam
      const contractConfigs = [
        { name: 'weatherOracle', address: deployedAddresses.WeatherOracle, abi: WEATHER_ORACLE_ABI },
        { name: 'weatherToken', address: deployedAddresses.WeatherToken, abi: WEATHER_TOKEN_ABI },
        { name: 'questManager', address: deployedAddresses.QuestManager, abi: QUEST_MANAGER_ABI },
        { name: 'weatherNFT', address: deployedAddresses.WeatherNFT, abi: WEATHER_NFT_ABI },
        { name: 'multiplayerSync', address: deployedAddresses.MultiplayerSync, abi: MULTIPLAYER_SYNC_ABI }
      ];

      for (const config of contractConfigs) {
        try {
          contractInstances[config.name] = new ethers.Contract(
            config.address,
            config.abi,
            signerInstance
          );
        } catch (error) {
          // Silent fail for individual contracts
        }
      }

      setContracts(contractInstances);
      console.log(`✅ ${Object.keys(contractInstances).length} contracts initialized`);

      return contractInstances;
    } catch (error) {
      setError('Contract initialization failed - running in demo mode');
      return {};
    }
  };

  // Disconnect wallet function - NO DEPENDENCIES
  const disconnectWallet = useCallback(() => {
    console.log('🔌 Disconnecting wallet');
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setBalance('0.000000');
    setTokenBalance('0');
    setCurrentWeather('Sunshine');
    setContracts({});
    setError(null);
  }, []);

  // Handle account changes - NO DEPENDENCIES
  const handleAccountsChanged = useCallback((accounts) => {
    console.log('👤 Account changed:', accounts);
    if (accounts.length === 0) {
      // Direct call to avoid dependency
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setIsConnected(false);
      setBalance('0.000000');
      setTokenBalance('0');
      setCurrentWeather('Sunshine');
      setContracts({});
      setError(null);
    } else {
      setAccount(accounts[0]);
    }
  }, []);

  // Handle network changes - NO DEPENDENCIES
  const handleChainChanged = useCallback(() => {
    console.log('🔄 Network changed, reloading...');
    window.location.reload();
  }, []);

  // Update balances function - MINIMAL DEPENDENCIES
  const updateBalances = useCallback(async (accountAddress = null) => {
    const targetAccount = accountAddress || account;
    if (!provider || !targetAccount) {
      return;
    }

    try {
      // Get STT balance
      const sttBalance = await provider.getBalance(targetAccount);
      const formattedBalance = ethers.formatEther(sttBalance);
      setBalance(formattedBalance);

      // Get token balance if contract exists
      if (contracts.weatherToken) {
        try {
          const tokenBal = await contracts.weatherToken.balanceOf(targetAccount);
          const formattedTokenBalance = ethers.formatEther(tokenBal);
          setTokenBalance(formattedTokenBalance);
        } catch (tokenError) {
          // Silent fail for token balance
        }
      }
    } catch (error) {
      console.error('Failed to update balances:', error);
    }
  }, [provider, account, contracts.weatherToken]);

  // MAIN WALLET CONNECTION - STANDALONE
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔗 Connecting wallet');

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this app');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      
      // Switch to Somnia network
      await switchToSomniaNetwork();

      // Get signer
      const web3Signer = await web3Provider.getSigner();

      // Update state
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setIsConnected(true);

      // Initialize contracts
      const contractInstances = await initializeContracts(web3Signer);

      // Update balances
      const sttBalance = await web3Provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(sttBalance));

      // Get current weather from contract or set default
      try {
        if (contractInstances.weatherOracle) {
          const weatherData = await contractInstances.weatherOracle.getCurrentWeather(0);
          const weatherName = WEATHER_TYPES[weatherData.weatherType] || 'Sunshine';
          setCurrentWeather(weatherName);
        } else {
          setCurrentWeather('Sunshine');
        }
      } catch (error) {
        setCurrentWeather('Sunshine');
      }

      console.log('✅ Wallet connected successfully');

    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      setIsConnected(false);
      setAccount(null);
      setSigner(null);
      setContracts({});
    } finally {
      setLoading(false);
    }
  }, []);

  // INITIALIZATION - ONLY ONCE
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      console.log('🚀 Initializing blockchain app');

      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask to use this app');
        return;
      }

      try {
        // Set up event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && mounted) {
          console.log('🔗 Already connected to account');
          
          // Create provider and connect directly
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          await switchToSomniaNetwork();
          const web3Signer = await web3Provider.getSigner();

          setProvider(web3Provider);
          setSigner(web3Signer);
          setAccount(accounts[0]);
          setIsConnected(true);

          // Initialize contracts
          const contractInstances = await initializeContracts(web3Signer);

          // Update balances
          const sttBalance = await web3Provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(sttBalance));

          // Get current weather
          try {
            if (contractInstances.weatherOracle) {
              const weatherData = await contractInstances.weatherOracle.getCurrentWeather(0);
              const weatherName = WEATHER_TYPES[weatherData.weatherType] || 'Sunshine';
              setCurrentWeather(weatherName);
            } else {
              setCurrentWeather('Sunshine');
            }
          } catch (error) {
            setCurrentWeather('Sunshine');
          }
        }
      } catch (error) {
        if (mounted) setError('Failed to initialize wallet connection');
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      mounted = false;
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []); // EMPTY DEPENDENCY ARRAY - NO LOOPS

  // Weather update function
  const updateWeather = useCallback(async (newWeatherId, zoneId = 0) => {
    if (!contracts.weatherOracle || !signer) {
      const weatherName = WEATHER_TYPES[newWeatherId] || 'Sunshine';
      setCurrentWeather(weatherName);
      return;
    }

    try {
      setLoading(true);
      console.log(`🌦️ Updating weather to: ${newWeatherId}`);

      const tx = await contracts.weatherOracle.changeWeather(zoneId, newWeatherId, 75, {
        gasLimit: 300000,
        gasPrice: ethers.parseUnits('15', 'gwei')
      });
      await tx.wait();

      const weatherName = WEATHER_TYPES[newWeatherId] || 'Sunshine';
      setCurrentWeather(weatherName);

      console.log('✅ Weather updated successfully');
      return tx;
    } catch (error) {
      console.error('❌ Failed to update weather:', error);
      setError('Weather update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts.weatherOracle, signer]);

  // Start quest
  const startQuest = async (questId) => {
    if (!contracts.questManager || !signer) {
      throw new Error('Quest contract not available');
    }

    try {
      setLoading(true);
      console.log(`🚀 Starting quest: ${questId}`);

      const tx = await contracts.questManager.startQuest(questId, {
        gasLimit: 200000,
        gasPrice: ethers.parseUnits('15', 'gwei')
      });
      await tx.wait();

      console.log('✅ Quest started successfully');
      return tx;
    } catch (error) {
      console.error('❌ Failed to start quest:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Complete quest
  const completeQuest = async (questId) => {
    if (!contracts.questManager || !signer) {
      throw new Error('Quest contract not available');
    }

    try {
      setLoading(true);
      console.log(`🏆 Completing quest: ${questId}`);

      const tx = await contracts.questManager.completeQuest(questId, {
        gasLimit: 250000,
        gasPrice: ethers.parseUnits('15', 'gwei')
      });
      await tx.wait();

      // Update balances after quest completion
      if (provider && account) {
        const sttBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(sttBalance));
      }

      console.log('✅ Quest completed successfully');
      return tx;
    } catch (error) {
      console.error('❌ Failed to complete quest:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mint NFT with correct function signature and payment
  const mintNFT = async (category = 1) => {
    if (!contracts.weatherNFT || !signer) {
      throw new Error('NFT contract not available');
    }

    try {
      setLoading(true);
      console.log(`🎨 Minting NFT category: ${category}`);

      // Get mint price from contract or use default
      let mintPrice;
      try {
        mintPrice = await contracts.weatherNFT.mintPrice();
        console.log('💰 Mint price from contract:', ethers.formatEther(mintPrice), 'STT');
      } catch (error) {
        mintPrice = ethers.parseEther("0.01");
        console.log('💰 Using fallback mint price: 0.01 STT');
      }

      // Call correct function with proper parameters
      const tx = await contracts.weatherNFT.mintWeatherNFT(category, {
        value: mintPrice, // Send payment
        gasLimit: 300000,
        gasPrice: ethers.parseUnits('15', 'gwei')
      });

      await tx.wait();
      
      // Update balances after minting
      if (provider && account) {
        const sttBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(sttBalance));
      }

      console.log('✅ NFT minted successfully');
      return tx;
    } catch (error) {
      console.error('❌ Failed to mint NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user NFTs
  const getUserNFTs = async (userAddress = null) => {
    const targetAddress = userAddress || account;
    if (!contracts.weatherNFT || !targetAddress) {
      return [];
    }

    try {
      const nftIds = await contracts.weatherNFT.getUserNFTs(targetAddress);
      return nftIds;
    } catch (error) {
      console.error('Failed to get user NFTs:', error);
      return [];
    }
  };

  // Get NFT metadata
  const getNFTMetadata = async (tokenId) => {
    if (!contracts.weatherNFT) {
      return null;
    }

    try {
      const metadata = await contracts.weatherNFT.getNFTMetadata(tokenId);
      return metadata;
    } catch (error) {
      console.error('Failed to get NFT metadata:', error);
      return null;
    }
  };

  // Get available quests
  const getAvailableQuests = async () => {
    if (!contracts.questManager) {
      return [];
    }

    try {
      const questIds = await contracts.questManager.getAvailableQuests();
      return questIds;
    } catch (error) {
      console.error('Failed to get available quests:', error);
      return [];
    }
  };

  // Get quest details
  const getQuestDetails = async (questId) => {
    if (!contracts.questManager) {
      return null;
    }

    try {
      const details = await contracts.questManager.getQuestDetails(questId);
      return details;
    } catch (error) {
      console.error('Failed to get quest details:', error);
      return null;
    }
  };

  // Get current weather state
  const getCurrentWeatherState = async (zoneId = 0) => {
    if (!contracts.weatherOracle) {
      return currentWeather;
    }

    try {
      const weatherData = await contracts.weatherOracle.getCurrentWeather(zoneId);
      const weatherName = WEATHER_TYPES[weatherData.weatherType] || 'Sunshine';
      setCurrentWeather(weatherName);
      return weatherName;
    } catch (error) {
      return currentWeather;
    }
  };

  // Get contract status with proper detection
  const getContractStatus = useCallback(() => {
    const contractCount = Object.keys(contracts).length;
    const hasRealContracts = contractCount > 0 && signer && isConnected;

    return {
      WeatherOracle: deployedAddresses.WeatherOracle,
      WeatherToken: deployedAddresses.WeatherToken,
      QuestManager: deployedAddresses.QuestManager,
      WeatherNFT: deployedAddresses.WeatherNFT,
      MultiplayerSync: deployedAddresses.MultiplayerSync,
      isConnected: hasRealContracts,
      contractCount: contractCount,
      network: NETWORK_CONFIG.name
    };
  }, [contracts, signer, isConnected]);

  return {
    // State
    account,
    isConnected,
    balance,
    tokenBalance,
    currentWeather,
    loading,
    error,
    provider,
    signer,
    contracts,

    // Actions
    connectWallet,
    disconnectWallet,
    updateWeather,
    startQuest,
    completeQuest,
    mintNFT,
    getUserNFTs,
    getNFTMetadata,
    getAvailableQuests,
    getQuestDetails,
    updateBalances,
    getCurrentWeatherState,
    getContractStatus
  };
};

export default useBlockchain;