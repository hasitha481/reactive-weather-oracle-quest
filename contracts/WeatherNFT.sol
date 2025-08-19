// ================================================
// FILE: contracts/WeatherNFT.sol
// PURPOSE: Dynamic NFTs that evolve with weather for grant showcase
// ================================================

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WeatherNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    enum NFTCategory {
        STORM_GEAR,      // 0 - Lightning resistance equipment
        COLLECTIBLE,     // 1 - Seasonal collectibles
        ANCIENT_ARTIFACT,// 2 - Mystical items
        ELEMENTAL_WEAPON,// 3 - Weather-powered weapons
        WEATHER_TOOL     // 4 - Utility items
    }

    enum Rarity {
        COMMON,     // 0 - 60% drop rate
        UNCOMMON,   // 1 - 25% drop rate
        RARE,       // 2 - 10% drop rate
        EPIC,       // 3 - 4% drop rate
        LEGENDARY,  // 4 - 0.9% drop rate
        MYTHIC      // 5 - 0.1% drop rate
    }

    struct NFTMetadata {
        NFTCategory category;
        Rarity rarity;
        uint256 weatherExposure;        // Total weather interactions
        uint256 evolutionStage;         // 0-5 (Common to Mythic)
        uint256 creationTimestamp;
        uint256 lastEvolution;
        mapping(uint256 => uint256) weatherTypeExposure; // Per weather type
        uint256 questsCompleted;
        uint256 stakingPower;           // Bonus for token staking
        bool isAnimated;                // Premium animated version
    }

    struct EvolutionRequirement {
        uint256 minWeatherExposure;
        uint256 minQuestCount;
        uint256 timeRequired;           // Minimum time since creation
        bool requiresSpecialWeather;    // Needs rare weather exposure
    }

    Counters.Counter private _tokenIdCounter;
    
    // State mappings for grant demo
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(uint256 => EvolutionRequirement) public evolutionReqs;
    mapping(address => uint256[]) public userNFTs;
    mapping(NFTCategory => mapping(Rarity => string)) public baseURIs;
    
    // Contract addresses
    address public weatherOracle;
    address public questManager;
    address public weatherToken;
    
    // Minting and evolution for grant demo
    uint256 public mintPrice = 0.01 ether;           // 0.01 ETH per mint
    uint256 public evolutionFee = 0.005 ether;       // 0.005 ETH per evolution
    uint256 public maxSupply = 10000;
    uint256 public totalMinted = 0;
    
    // Revenue sharing
    address public treasury;
    uint256 public creatorRoyalty = 750; // 7.5%
    
    // Events for grant demo
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        NFTCategory category,
        Rarity rarity
    );
    
    event NFTEvolved(
        uint256 indexed tokenId,
        Rarity oldRarity,
        Rarity newRarity,
        uint256 newStakingPower
    );
    
    event WeatherExposureGained(
        uint256 indexed tokenId,
        uint256 weatherType,
        uint256 newExposureCount
    );

    constructor(
        string memory name,
        string memory symbol,
        address _treasury
    ) ERC721(name, symbol) {
        treasury = _treasury;
        _initializeEvolutionRequirements();
        _initializeBaseURIs();
    }

    function _initializeEvolutionRequirements() private {
        // Common to Uncommon (GRANT SHOWCASE: PROGRESSIVE GAMEPLAY)
        evolutionReqs[1] = EvolutionRequirement({
            minWeatherExposure: 5,
            minQuestCount: 3,
            timeRequired: 1 days,
            requiresSpecialWeather: false
        });

        // Uncommon to Rare
        evolutionReqs[2] = EvolutionRequirement({
            minWeatherExposure: 15,
            minQuestCount: 10,
            timeRequired: 3 days,
            requiresSpecialWeather: false
        });

        // Rare to Epic (GRANT FEATURE: LONG-TERM ENGAGEMENT)
        evolutionReqs[3] = EvolutionRequirement({
            minWeatherExposure: 35,
            minQuestCount: 25,
            timeRequired: 7 days,
            requiresSpecialWeather: true
        });

        // Epic to Legendary
        evolutionReqs[4] = EvolutionRequirement({
            minWeatherExposure: 75,
            minQuestCount: 50,
            timeRequired: 14 days,
            requiresSpecialWeather: true
        });

        // Legendary to Mythic (GRANT SHOWCASE: ULTRA-RARE ACHIEVEMENTS)
        evolutionReqs[5] = EvolutionRequirement({
            minWeatherExposure: 150,
            minQuestCount: 100,
            timeRequired: 30 days,
            requiresSpecialWeather: true
        });
    }

    function _initializeBaseURIs() private {
        // Initialize IPFS base URIs - FOR GRANT DEMO
        baseURIs[NFTCategory.STORM_GEAR][Rarity.COMMON] = "ipfs://QmStormGearCommon/";
        baseURIs[NFTCategory.STORM_GEAR][Rarity.UNCOMMON] = "ipfs://QmStormGearUncommon/";
        baseURIs[NFTCategory.STORM_GEAR][Rarity.RARE] = "ipfs://QmStormGearRare/";
        baseURIs[NFTCategory.STORM_GEAR][Rarity.EPIC] = "ipfs://QmStormGearEpic/";
        baseURIs[NFTCategory.STORM_GEAR][Rarity.LEGENDARY] = "ipfs://QmStormGearLegendary/";
        baseURIs[NFTCategory.STORM_GEAR][Rarity.MYTHIC] = "ipfs://QmStormGearMythic/";

        baseURIs[NFTCategory.COLLECTIBLE][Rarity.COMMON] = "ipfs://QmCollectibleCommon/";
        baseURIs[NFTCategory.COLLECTIBLE][Rarity.UNCOMMON] = "ipfs://QmCollectibleUncommon/";
        baseURIs[NFTCategory.COLLECTIBLE][Rarity.RARE] = "ipfs://QmCollectibleRare/";
        baseURIs[NFTCategory.COLLECTIBLE][Rarity.EPIC] = "ipfs://QmCollectibleEpic/";
        baseURIs[NFTCategory.COLLECTIBLE][Rarity.LEGENDARY] = "ipfs://QmCollectibleLegendary/";
        baseURIs[NFTCategory.COLLECTIBLE][Rarity.MYTHIC] = "ipfs://QmCollectibleMythic/";
    }

    /**
     * @dev Mint new weather NFT - MAIN GRANT FEATURE
     * @param category NFT category to mint
     */
    function mintWeatherNFT(NFTCategory category) external payable nonReentrant {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(totalMinted < maxSupply, "Max supply reached");
        require(uint256(category) <= 4, "Invalid category");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Generate random rarity (GRANT SHOWCASE: FAIR DISTRIBUTION)
        Rarity rarity = _generateRandomRarity();
        
        // Create NFT metadata
        NFTMetadata storage metadata = nftMetadata[tokenId];
        metadata.category = category;
        metadata.rarity = rarity;
        metadata.weatherExposure = 0;
        metadata.evolutionStage = uint256(rarity);
        metadata.creationTimestamp = block.timestamp;
        metadata.lastEvolution = block.timestamp;
        metadata.questsCompleted = 0;
        metadata.stakingPower = _calculateStakingPower(rarity);
        metadata.isAnimated = _shouldBeAnimated(rarity);

        // Mint NFT
        _safeMint(msg.sender, tokenId);
        userNFTs[msg.sender].push(tokenId);
        totalMinted++;

        // Set token URI
        string memory uri = _generateTokenURI(tokenId);
        _setTokenURI(tokenId, uri);

        // Handle payment
        _handlePayment();

        emit NFTMinted(tokenId, msg.sender, category, rarity);
    }

    /**
     * @dev Record weather exposure for NFT - GRANT KEY FEATURE
     * @param tokenId NFT to update
     * @param weatherType Weather type (0-8)
     */
    function recordWeatherExposure(
        uint256 tokenId, 
        uint256 weatherType
    ) external {
        require(_exists(tokenId), "NFT does not exist");
        require(
            msg.sender == weatherOracle || msg.sender == questManager || msg.sender == owner(),
            "Unauthorized"
        );
        require(weatherType <= 8, "Invalid weather type");

        NFTMetadata storage metadata = nftMetadata[tokenId];
        metadata.weatherExposure++;
        metadata.weatherTypeExposure[weatherType]++;

        emit WeatherExposureGained(tokenId, weatherType, metadata.weatherTypeExposure[weatherType]);

        // Check for auto-evolution (GRANT SHOWCASE: DYNAMIC PROGRESSION)
        _checkAutoEvolution(tokenId);
    }

    /**
     * @dev Record quest completion for NFT
     * @param tokenId NFT that completed quest
     * @param difficulty Quest difficulty multiplier
     */
    function recordQuestCompletion(
        uint256 tokenId,
        uint256 difficulty
    ) external {
        require(_exists(tokenId), "NFT does not exist");
        require(msg.sender == questManager || msg.sender == owner(), "Unauthorized");

        NFTMetadata storage metadata = nftMetadata[tokenId];
        metadata.questsCompleted++;

        emit WeatherExposureGained(tokenId, 999, metadata.questsCompleted); // Quest completion event

        // Check for auto-evolution
        _checkAutoEvolution(tokenId);
    }

    /**
     * @dev Manually evolve NFT - GRANT FEATURE: PLAYER CHOICE
     * @param tokenId NFT to evolve
     */
    function evolveNFT(uint256 tokenId) external payable nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(msg.value >= evolutionFee, "Insufficient payment for evolution");

        _performEvolution(tokenId);
        _handlePayment();
    }

    /**
     * @dev Check if NFT can auto-evolve and perform evolution
     */
    function _checkAutoEvolution(uint256 tokenId) private {
        NFTMetadata storage metadata = nftMetadata[tokenId];
        Rarity currentRarity = metadata.rarity;
        
        if (currentRarity == Rarity.MYTHIC) return; // Already max rarity

        uint256 nextRarityIndex = uint256(currentRarity) + 1;
        EvolutionRequirement storage req = evolutionReqs[nextRarityIndex];

        if (_meetsEvolutionRequirements(tokenId, req)) {
            _performEvolution(tokenId);
        }
    }

    /**
     * @dev Perform NFT evolution - GRANT SHOWCASE: DYNAMIC NFTS
     */
    function _performEvolution(uint256 tokenId) private {
        NFTMetadata storage metadata = nftMetadata[tokenId];
        Rarity oldRarity = metadata.rarity;
        
        require(oldRarity != Rarity.MYTHIC, "Already at maximum rarity");

        Rarity newRarity = Rarity(uint256(oldRarity) + 1);
        metadata.rarity = newRarity;
        metadata.evolutionStage = uint256(newRarity);
        metadata.lastEvolution = block.timestamp;
        metadata.stakingPower = _calculateStakingPower(newRarity);

        // Update token URI (GRANT FEATURE: VISUAL PROGRESSION)
        string memory newURI = _generateTokenURI(tokenId);
        _setTokenURI(tokenId, newURI);

        emit NFTEvolved(tokenId, oldRarity, newRarity, metadata.stakingPower);
    }

    /**
     * @dev Check if NFT meets evolution requirements
     */
    function _meetsEvolutionRequirements(
        uint256 tokenId, 
        EvolutionRequirement storage req
    ) private view returns (bool) {
        NFTMetadata storage metadata = nftMetadata[tokenId];

        // Check basic requirements
        if (metadata.weatherExposure < req.minWeatherExposure) return false;
        if (metadata.questsCompleted < req.minQuestCount) return false;
        if (block.timestamp - metadata.creationTimestamp < req.timeRequired) return false;

        // Check special weather requirement (GRANT FEATURE: RARE WEATHER IMPORTANCE)
        if (req.requiresSpecialWeather) {
            bool hasSpecialWeather = false;
            // Check for rare weather exposure (Aurora, Sandstorm, Tornado, Eclipse)
            for (uint256 i = 5; i <= 8; i++) {
                if (metadata.weatherTypeExposure[i] > 0) {
                    hasSpecialWeather = true;
                    break;
                }
            }
            if (!hasSpecialWeather) return false;
        }

        return true;
    }

    /**
     * @dev Generate random rarity - GRANT SHOWCASE: FAIR DROP RATES
     */
    function _generateRandomRarity() private view returns (Rarity) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            totalMinted
        ))) % 1000;

        if (random < 1) return Rarity.MYTHIC;      // 0.1%
        if (random < 10) return Rarity.LEGENDARY;  // 0.9%
        if (random < 50) return Rarity.EPIC;       // 4%
        if (random < 150) return Rarity.RARE;      // 10%
        if (random < 400) return Rarity.UNCOMMON;  // 25%
        return Rarity.COMMON;                      // 60%
    }

    /**
     * @dev Calculate staking power based on rarity
     */
    function _calculateStakingPower(Rarity rarity) private pure returns (uint256) {
        if (rarity == Rarity.MYTHIC) return 1000;      // 10x multiplier
        if (rarity == Rarity.LEGENDARY) return 500;    // 5x multiplier
        if (rarity == Rarity.EPIC) return 250;         // 2.5x multiplier
        if (rarity == Rarity.RARE) return 150;         // 1.5x multiplier
        if (rarity == Rarity.UNCOMMON) return 120;     // 1.2x multiplier
        return 100;                                     // 1x multiplier
    }

    /**
     * @dev Should NFT be animated based on rarity
     */
    function _shouldBeAnimated(Rarity rarity) private view returns (bool) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender
        ))) % 100;

        if (rarity == Rarity.MYTHIC) return true;       // 100%
        if (rarity == Rarity.LEGENDARY) return random < 80; // 80%
        if (rarity == Rarity.EPIC) return random < 50;      // 50%
        if (rarity == Rarity.RARE) return random < 20;      // 20%
        return random < 5;                                   // 5% for others
    }

    /**
     * @dev Generate token URI for grant demo
     */
    function _generateTokenURI(uint256 tokenId) private view returns (string memory) {
        NFTMetadata storage metadata = nftMetadata[tokenId];
        string memory baseURI = baseURIs[metadata.category][metadata.rarity];
        
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    /**
     * @dev Handle payment distribution
     */
    function _handlePayment() private {
        uint256 amount = msg.value;
        uint256 royalty = (amount * creatorRoyalty) / 10000;
        uint256 treasuryAmount = amount - royalty;

        // Send to treasury
        payable(treasury).transfer(treasuryAmount);
    }

    // View functions for grant demo frontend
    function getNFTMetadata(uint256 tokenId) external view returns (
        NFTCategory category,
        Rarity rarity,
        uint256 weatherExposure,
        uint256 evolutionStage,
        uint256 questsCompleted,
        uint256 stakingPower,
        bool isAnimated
    ) {
        require(_exists(tokenId), "NFT does not exist");
        
        NFTMetadata storage metadata = nftMetadata[tokenId];
        return (
            metadata.category,
            metadata.rarity,
            metadata.weatherExposure,
            metadata.evolutionStage,
            metadata.questsCompleted,
            metadata.stakingPower,
            metadata.isAnimated
        );
    }

    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }

    function getEvolutionRequirements(uint256 rarityLevel) external view returns (
        uint256 minWeatherExposure,
        uint256 minQuestCount,
        uint256 timeRequired,
        bool requiresSpecialWeather
    ) {
        EvolutionRequirement storage req = evolutionReqs[rarityLevel];
        return (
            req.minWeatherExposure,
            req.minQuestCount,
            req.timeRequired,
            req.requiresSpecialWeather
        );
    }

    function canEvolve(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        
        NFTMetadata storage metadata = nftMetadata[tokenId];
        if (metadata.rarity == Rarity.MYTHIC) return false;

        uint256 nextRarityIndex = uint256(metadata.rarity) + 1;
        EvolutionRequirement storage req = evolutionReqs[nextRarityIndex];

        return _meetsEvolutionRequirements(tokenId, req);
    }

    // Admin functions for grant demo
    function setContractAddresses(
        address _weatherOracle,
        address _questManager,
        address _weatherToken
    ) external onlyOwner {
        weatherOracle = _weatherOracle;
        questManager = _questManager;
        weatherToken = _weatherToken;
    }

    function updateMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function updateEvolutionFee(uint256 newFee) external onlyOwner {
        evolutionFee = newFee;
    }

    function updateBaseURI(
        NFTCategory category,
        Rarity rarity,
        string memory newURI
    ) external onlyOwner {
        baseURIs[category][rarity] = newURI;
    }

    function emergencyEvolution(uint256 tokenId) external onlyOwner {
        _performEvolution(tokenId);
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Required overrides
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}