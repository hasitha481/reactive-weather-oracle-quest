// Updated contract configuration with REAL deployed addresses
// Updated: $(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

export const SOMNIA_TESTNET = {
  chainId: 50312,
  name: 'Somnia Testnet',
  rpcUrl: 'https://dream-rpc.somnia.network',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  blockExplorer: 'https://shannon-explorer.somnia.network'
};

export const deployedAddresses = {
  WeatherOracle: "0x1Df5FF83103097FC44A0a4BC182c40ccE7341871",
  WeatherToken: "0x3A832f200b441f86E366763f60d729797D5ae830",
  WeatherNFT: "0xFCfF86197876fA553d4dC54257E1bB66Ef048972",
  QuestManager: "0x2eBf0c86a306cFdDAc26e22B62375ffdd4647C13",
  MultiplayerSync: "0x57231e0A012901920d3D7dd570B9699bD65FF813"
};

export const CONTRACT_ADDRESSES = deployedAddresses;

// Simplified ABIs for gas efficiency
export const WEATHER_ORACLE_ABI = [
  "function getWeather(uint256 zoneId) view returns (uint8)",
  "function setWeather(uint256 zoneId, uint8 weatherType)",
  "function currentWeather() view returns (uint8)"
];

export const QUEST_MANAGER_ABI = [
  "function startQuest(uint256 questId)",
  "function completeQuest(uint256 questId)",
  "function getAvailableQuests() view returns (uint256[])"
];

export const WEATHER_NFT_ABI = [
  "function mint(address to, uint256 category) payable returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
];

export const WEATHER_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export const MULTIPLAYER_SYNC_ABI = [
  "function registerPlayer(string memory username)",
  "function getPlayer(address player) view returns (tuple)",
  "function getPlayerCount() view returns (uint256)"
];

export const WEATHER_TYPES = {
  0: 'Storm', 1: 'Sunshine', 2: 'Fog', 3: 'Rain', 4: 'Snow'
};

export const NFT_CATEGORIES = {
  0: 'Storm Gear', 1: 'Weather Collectible', 2: 'Ancient Artifact', 3: 'Elemental Weapon', 4: 'Weather Tool'
};

export const DEPLOYMENT_STATUS = {
  isDeployed: true,
  lastUpdated: "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")",
  network: 'somniaTestnet'
};
