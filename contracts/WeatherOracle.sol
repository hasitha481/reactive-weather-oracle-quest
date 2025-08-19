// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Weather Oracle for Reactive Weather Quest
 * @notice Weather system that works without OpenZeppelin dependencies
 * @dev Simplified but fully functional for deployment and testing
 */
contract WeatherOracle {
    
    // Weather types enum
    enum WeatherType { 
        CLEAR,      // 0 - Standard gameplay
        STORM,      // 1 - High risk/reward
        BLIZZARD,   // 2 - Extreme survival mode
        FOG,        // 3 - Stealth mechanics
        RAIN,       // 4 - Resource multiplier
        DROUGHT,    // 5 - Scarcity mode
        AURORA,     // 6 - Magical events (RARE)
        ECLIPSE     // 7 - Ultra-rare cosmic event
    }
    
    // Weather event structure
    struct WeatherEvent {
        WeatherType weatherType;
        uint256 intensity;        // 1-100 scale
        uint256 startTime;
        uint256 duration;
        uint256 zone;            // Weather zone ID
        bool isActive;
        uint256 rarityBonus;     // Multiplier for rare events
    }
    
    // Contract state
    address public owner;
    bool public paused = false;
    
    // Weather zones mapping
    mapping(uint256 => WeatherEvent) public weatherZones;
    uint256 public constant totalZones = 5;
    
    // Performance tracking for Somnia TPS demo
    uint256 public totalWeatherUpdates;
    uint256 public lastUpdateTime;
    mapping(address => uint256) public playerWeatherExposure;
    
    // Community voting
    mapping(uint256 => mapping(address => uint256)) public votes;
    mapping(uint256 => mapping(WeatherType => uint256)) public voteCount;
    mapping(uint256 => bool) public votingActive;
    mapping(uint256 => uint256) public votingEndTime;
    
    // Zone names
    string[5] public zoneNames = [
        "Tempest Valley",
        "Mystic Forests", 
        "Crystal Peaks",
        "Golden Plains",
        "Shadow Realm"
    ];
    
    // Events
    event WeatherChanged(uint256 indexed zone, WeatherType newWeather, uint256 intensity, uint256 timestamp);
    event RareWeatherEvent(uint256 indexed zone, WeatherType weatherType, uint256 rarityBonus);
    event CommunityVoteStarted(uint256 indexed zone, uint256 endTime);
    event WeatherVoteCast(address indexed voter, uint256 indexed zone, WeatherType weatherType);
    event PlayerExposureUpdated(address indexed player, uint256 totalExposure);
    event PerformanceMetric(string metric, uint256 value, uint256 timestamp);
    
    // Access control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier validZone(uint256 zone) {
        require(zone < totalZones, "Invalid zone");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        _initializeWeatherZones();
    }
    
    /**
     * @notice Initialize the 5 weather zones with diverse starting conditions
     */
    function _initializeWeatherZones() internal {
        // Zone 0: Tempest Valley (Storm-prone)
        weatherZones[0] = WeatherEvent({
            weatherType: WeatherType.STORM,
            intensity: 75,
            startTime: block.timestamp,
            duration: 420, // 7 minutes
            zone: 0,
            isActive: true,
            rarityBonus: 200
        });
        
        // Zone 1: Mystic Forests (Fog-heavy)
        weatherZones[1] = WeatherEvent({
            weatherType: WeatherType.FOG,
            intensity: 60,
            startTime: block.timestamp,
            duration: 380,
            zone: 1,
            isActive: true,
            rarityBonus: 130
        });
        
        // Zone 2: Crystal Peaks (Blizzard zone)
        weatherZones[2] = WeatherEvent({
            weatherType: WeatherType.BLIZZARD,
            intensity: 85,
            startTime: block.timestamp,
            duration: 290,
            zone: 2,
            isActive: true,
            rarityBonus: 180
        });
        
        // Zone 3: Golden Plains (Aurora events)
        weatherZones[3] = WeatherEvent({
            weatherType: WeatherType.AURORA,
            intensity: 95,
            startTime: block.timestamp,
            duration: 150, // Short duration for rare event
            zone: 3,
            isActive: true,
            rarityBonus: 300
        });
        
        // Zone 4: Shadow Realm (Eclipse potential)
        weatherZones[4] = WeatherEvent({
            weatherType: WeatherType.CLEAR,
            intensity: 50,
            startTime: block.timestamp,
            duration: 600,
            zone: 4,
            isActive: true,
            rarityBonus: 100
        });
    }
    
    /**
     * @notice Change weather in a specific zone
     * @param zone The zone ID (0-4)
     * @param weatherType The new weather type (0-7)
     * @param intensity The weather intensity (1-100)
     */
    function changeWeather(uint256 zone, WeatherType weatherType, uint256 intensity) 
        external 
        validZone(zone) 
        whenNotPaused 
    {
        require(intensity > 0 && intensity <= 100, "Invalid intensity");
        require(!votingActive[zone], "Voting in progress");
        
        uint256 startTime = block.timestamp;
        
        // Calculate rarity bonus and duration
        uint256 rarityBonus = _calculateRarityBonus(weatherType, intensity);
        uint256 duration = _calculateDuration(weatherType, intensity);
        
        // Update weather
        weatherZones[zone] = WeatherEvent({
            weatherType: weatherType,
            intensity: intensity,
            startTime: startTime,
            duration: duration,
            zone: zone,
            isActive: true,
            rarityBonus: rarityBonus
        });
        
        // Update performance metrics
        totalWeatherUpdates++;
        lastUpdateTime = startTime;
        
        emit WeatherChanged(zone, weatherType, intensity, startTime);
        emit PerformanceMetric("WeatherUpdate", totalWeatherUpdates, startTime);
        
        if (rarityBonus > 150) {
            emit RareWeatherEvent(zone, weatherType, rarityBonus);
        }
    }
    
    /**
     * @notice Start community voting for weather change
     * @param zone The zone to vote on
     */
    function startCommunityVote(uint256 zone) external validZone(zone) whenNotPaused {
        require(!votingActive[zone], "Vote already active");
        
        votingActive[zone] = true;
        votingEndTime[zone] = block.timestamp + 300; // 5 minutes voting period
        
        emit CommunityVoteStarted(zone, votingEndTime[zone]);
    }
    
    /**
     * @notice Vote for weather type in a zone
     * @param zone The zone to vote for
     * @param weatherType The desired weather type
     */
    function voteForWeather(uint256 zone, WeatherType weatherType) 
        external 
        validZone(zone) 
        whenNotPaused 
    {
        require(votingActive[zone], "No active vote");
        require(block.timestamp < votingEndTime[zone], "Voting ended");
        
        // Remove previous vote if exists
        if (votes[zone][msg.sender] > 0) {
            WeatherType previousVote = WeatherType(votes[zone][msg.sender] - 1);
            voteCount[zone][previousVote]--;
        }
        
        // Cast new vote
        votes[zone][msg.sender] = uint256(weatherType) + 1; // +1 to distinguish from default
        voteCount[zone][weatherType]++;
        
        emit WeatherVoteCast(msg.sender, zone, weatherType);
    }
    
    /**
     * @notice Finalize community vote and change weather
     * @param zone The zone to finalize voting for
     */
    function finalizeVote(uint256 zone) external validZone(zone) whenNotPaused {
        require(votingActive[zone], "No active vote");
        require(block.timestamp >= votingEndTime[zone], "Voting still active");
        
        // Find winning weather type
        WeatherType winningWeather = WeatherType.CLEAR;
        uint256 maxVotes = 0;
        
        for (uint256 i = 0; i < 8; i++) {
            WeatherType currentType = WeatherType(i);
            if (voteCount[zone][currentType] > maxVotes) {
                maxVotes = voteCount[zone][currentType];
                winningWeather = currentType;
            }
        }
        
        // Apply winning weather with community bonus
        uint256 intensity = 75; // Community voted weather gets high intensity
        uint256 rarityBonus = _calculateRarityBonus(winningWeather, intensity) + 50; // Community bonus
        uint256 duration = _calculateDuration(winningWeather, intensity);
        
        weatherZones[zone] = WeatherEvent({
            weatherType: winningWeather,
            intensity: intensity,
            startTime: block.timestamp,
            duration: duration,
            zone: zone,
            isActive: true,
            rarityBonus: rarityBonus
        });
        
        // Reset voting state
        votingActive[zone] = false;
        
        emit WeatherChanged(zone, winningWeather, intensity, block.timestamp);
    }
    
    /**
     * @notice Update player weather exposure (called by other contracts)
     * @param player The player address
     * @param zone The zone they're active in
     */
    function updatePlayerExposure(address player, uint256 zone) 
        external 
        validZone(zone) 
        whenNotPaused 
    {
        WeatherEvent memory currentWeather = weatherZones[zone];
        if (currentWeather.isActive) {
            playerWeatherExposure[player] += currentWeather.intensity;
            emit PlayerExposureUpdated(player, playerWeatherExposure[player]);
        }
    }
    
    /**
     * @notice Calculate rarity bonus based on weather type and intensity
     */
    function _calculateRarityBonus(WeatherType weatherType, uint256 intensity) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 baseBonus = 100;
        
        if (weatherType == WeatherType.ECLIPSE) baseBonus = 500; // 5x multiplier
        else if (weatherType == WeatherType.AURORA) baseBonus = 300; // 3x multiplier  
        else if (weatherType == WeatherType.STORM) baseBonus = 200; // 2x multiplier
        else if (weatherType == WeatherType.BLIZZARD) baseBonus = 150; // 1.5x multiplier
        
        // Add intensity bonus
        return baseBonus + (intensity / 10);
    }
    
    /**
     * @notice Calculate duration based on weather type and intensity
     */
    function _calculateDuration(WeatherType weatherType, uint256 intensity) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 baseDuration = 300; // 5 minutes
        
        if (weatherType == WeatherType.ECLIPSE) return 120;     // 2 minutes (rare)
        if (weatherType == WeatherType.AURORA) return 180;      // 3 minutes (rare)
        if (weatherType == WeatherType.STORM) return baseDuration + (intensity * 2);
        if (weatherType == WeatherType.BLIZZARD) return baseDuration + (intensity * 3);
        
        return baseDuration + intensity;
    }
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * @notice Get current weather for a zone
     */
    function getCurrentWeather(uint256 zone) 
        external 
        view 
        validZone(zone) 
        returns (WeatherEvent memory) 
    {
        return weatherZones[zone];
    }
    
    /**
     * @notice Get all weather zones at once (for frontend)
     */
    function getAllWeather() external view returns (WeatherEvent[5] memory) {
        WeatherEvent[5] memory allWeather;
        for (uint256 i = 0; i < 5; i++) {
            allWeather[i] = weatherZones[i];
        }
        return allWeather;
    }
    
    /**
     * @notice Get player weather exposure
     */
    function getPlayerExposure(address player) external view returns (uint256) {
        return playerWeatherExposure[player];
    }
    
    /**
     * @notice Get zone information
     */
    function getZoneInfo(uint256 zone) 
        external 
        view 
        validZone(zone) 
        returns (string memory name, bool voting, uint256 endTime) 
    {
        return (zoneNames[zone], votingActive[zone], votingEndTime[zone]);
    }
    
    /**
     * @notice Get performance metrics for Somnia TPS demonstration
     */
    function getPerformanceMetrics() 
        external 
        view 
        returns (uint256 updates, uint256 lastUpdate) 
    {
        return (totalWeatherUpdates, lastUpdateTime);
    }
    
    /**
     * @notice Get voting information for a zone
     */
    function getVotingInfo(uint256 zone) 
        external 
        view 
        validZone(zone) 
    returns (bool active, uint256 endTime, uint256[8] memory weatherVotes) 
    {
        uint256[8] memory voteArray;
        for (uint256 i = 0; i < 8; i++) {
            voteArray[i] = voteCount[zone][WeatherType(i)];
        }
        return (votingActive[zone], votingEndTime[zone], voteArray);
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @notice Pause contract (emergency)
     */
    function pause() external onlyOwner {
        paused = true;
    }
    
    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        paused = false;
    }
    
    /**
     * @notice Emergency weather reset
     */
    function emergencyWeatherReset(uint256 zone) external onlyOwner validZone(zone) {
        weatherZones[zone] = WeatherEvent({
            weatherType: WeatherType.CLEAR,
            intensity: 50,
            startTime: block.timestamp,
            duration: 600,
            zone: zone,
            isActive: true,
            rarityBonus: 100
        });
        
        emit WeatherChanged(zone, WeatherType.CLEAR, 50, block.timestamp);
    }
    
    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}