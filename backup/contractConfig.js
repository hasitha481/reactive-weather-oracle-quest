// FILE: frontend/src/contracts/contractConfig.js
// FINAL FIXED VERSION - All addresses properly checksummed

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

// CRITICAL FIX: All addresses converted to proper EIP-55 checksum format
export const deployedAddresses = {
  WeatherOracle: "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
  WeatherToken: "0x3A832f200b441f86E366763f60D729797D5AE830",  // FIXED: lowercase 'f' corrected
  WeatherNFT: "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
  QuestManager: "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
  MultiplayerSync: "0x57231e0A012901920d3D7dd570B9699bD65FF813"
};

export const CONTRACT_ADDRESSES = deployedAddresses;

export const WEATHER_TYPES = {
  0: 'Storm', 1: 'Sunshine', 2: 'Fog', 3: 'Rain', 4: 'Snow'
};

export const NFT_CATEGORIES = {
  0: 'Storm Gear', 1: 'Weather Collectible', 2: 'Ancient Artifact', 3: 'Elemental Weapon', 4: 'Weather Tool'
};

export const DEPLOYMENT_STATUS = {
  isDeployed: true,
  lastUpdated: "2025-08-19T16:30:00.000Z",
  network: 'somniaTestnet'
};