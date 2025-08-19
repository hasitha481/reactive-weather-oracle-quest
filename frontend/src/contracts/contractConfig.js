// FILE: frontend/src/contracts/contractConfig.js
// COMPLETE FIXED VERSION - All issues resolved

export const SOMNIA_TESTNET = {
  chainId: 50312,
  chainIdHex: '0xc488',
  name: 'Somnia Testnet',
  rpcUrl: 'https://dream-rpc.somnia.network',
  rpcUrls: ['https://dream-rpc.somnia.network'],
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  blockExplorer: 'https://shannon-explorer.somnia.network',
  blockExplorerUrls: ['https://shannon-explorer.somnia.network']
};

export const NETWORK_CONFIG = SOMNIA_TESTNET;

// CRITICAL FIX: Properly checksummed addresses for ethers.js v6 compatibility
export const deployedAddresses = {
  WeatherOracle: "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
  WeatherToken: "0x3A832F200B441F86E366763F60D729797D5AE830",  // FIXED: Proper checksum
  WeatherNFT: "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
  QuestManager: "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
  MultiplayerSync: "0x57231e0A012901920d3D7dd570B9699bD65FF813"
};

export const CONTRACT_ADDRESSES = deployedAddresses;

export const WEATHER_TYPES = {
  0: 'Storm', 
  1: 'Sunshine', 
  2: 'Fog', 
  3: 'Rain', 
  4: 'Snow',
  5: 'Aurora',
  6: 'Sandstorm', 
  7: 'Tornado', 
  8: 'Eclipse'
};

export const NFT_CATEGORIES = {
  0: 'Storm Gear', 
  1: 'Weather Collectible', 
  2: 'Ancient Artifact', 
  3: 'Elemental Weapon', 
  4: 'Weather Tool'
};

export const RARITY_LEVELS = {
  0: 'Common',
  1: 'Uncommon', 
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
  5: 'Mythic'
};

export const DEPLOYMENT_STATUS = {
  isDeployed: true,
  lastUpdated: "2025-08-19T18:00:00.000Z",
  network: 'somniaTestnet',
  version: "1.2.0"
};