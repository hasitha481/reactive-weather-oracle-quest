// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WeatherToken.sol";

contract QuestManager {
    WeatherToken public immutable weatherToken;
    address public weatherOracle; // Reference but don't enforce interface
    
    uint256 private questCounter;
    
    struct Quest {
        uint256 id;
        uint8 requiredWeather; // Weather type required (0-6)
        uint256 reward;        // $WEATHER token reward
        uint256 difficulty;    // 1-5 difficulty level
        bool active;
        uint256 completions;   // Number of times completed
        string description;
    }
    
    struct PlayerQuest {
        uint256 questId;
        uint256 startTime;
        bool completed;
        uint256 completedTime;
        uint8 weatherAtStart; // Weather when quest was started
    }
    
    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => PlayerQuest)) public playerQuests;
    mapping(address => uint256[]) public playerCompletedQuests;
    mapping(address => uint256) public playerXP;
    
    // Manual weather setting for testing (can be updated by oracle)
    uint8 public currentWeather = 0;
    
    event QuestCreated(uint256 indexed questId, uint8 requiredWeather, uint256 reward);
    event QuestCompleted(address indexed player, uint256 indexed questId, uint256 reward);
    event QuestStarted(address indexed player, uint256 indexed questId, uint8 weather);
    event WeatherUpdated(uint8 newWeather);
    
    modifier validWeather(uint8 weather) {
        require(weather <= 6, "Invalid weather type");
        _;
    }
    
    constructor(address _weatherOracle, address _weatherToken) {
        weatherOracle = _weatherOracle;
        weatherToken = WeatherToken(_weatherToken);
        
        // Create initial quests for each weather type
        _createInitialQuests();
    }
    
    function _createInitialQuests() private {
        // Storm quests (weather type 1)
        _createQuest(1, 100 * 10**18, 5, "Survive the Lightning Storm");
        _createQuest(1, 75 * 10**18, 4, "Storm Chaser Challenge");
        
        // Sunshine quests (weather type 2) 
        _createQuest(2, 50 * 10**18, 2, "Solar Energy Collector");
        _createQuest(2, 60 * 10**18, 3, "Bright Valley Explorer");
        
        // Fog quests (weather type 3)
        _createQuest(3, 80 * 10**18, 4, "Shadow Walker Mission");
        _createQuest(3, 70 * 10**18, 3, "Find the Hidden Treasure");
        
        // Rain quests (weather type 4)
        _createQuest(4, 40 * 10**18, 2, "Rainwater Collection");
        _createQuest(4, 55 * 10**18, 3, "Puddle Jump Challenge");
        
        // Snow quests (weather type 5)
        _createQuest(5, 90 * 10**18, 4, "Build Ice Shelter");
        _createQuest(5, 65 * 10**18, 3, "Snowball Fight Tournament");
        
        // Clear/Calm quests (weather type 0)
        _createQuest(0, 30 * 10**18, 1, "Peaceful Meditation");
        _createQuest(0, 45 * 10**18, 2, "Clear Sky Observation");
        
        // Universal quests (any weather type 6)
        _createQuest(6, 35 * 10**18, 2, "Weather Watcher");
        _createQuest(6, 25 * 10**18, 1, "Daily Adventure");
    }
    
    function _createQuest(
        uint8 requiredWeather, 
        uint256 reward, 
        uint256 difficulty, 
        string memory description
    ) private validWeather(requiredWeather) {
        questCounter++;
        
        quests[questCounter] = Quest({
            id: questCounter,
            requiredWeather: requiredWeather,
            reward: reward,
            difficulty: difficulty,
            active: true,
            completions: 0,
            description: description
        });
        
        emit QuestCreated(questCounter, requiredWeather, reward);
    }
    
    // Manual weather update function (can be called by oracle or for testing)
    function updateWeather(uint8 newWeather) external validWeather(newWeather) {
        // In production, add access control here
        currentWeather = newWeather;
        emit WeatherUpdated(newWeather);
    }
    
    function startQuest(uint256 questId) external {
        require(quests[questId].active, "Quest not active");
        require(!playerQuests[msg.sender][questId].completed, "Quest already completed");
        require(playerQuests[msg.sender][questId].startTime == 0, "Quest already started");
        
        // Check if current weather matches quest requirement (or universal quest)
        uint8 requiredWeather = quests[questId].requiredWeather;
        require(
            currentWeather == requiredWeather || requiredWeather == 6, 
            "Weather conditions not met"
        );
        
        playerQuests[msg.sender][questId] = PlayerQuest({
            questId: questId,
            startTime: block.timestamp,
            completed: false,
            completedTime: 0,
            weatherAtStart: currentWeather
        });
        
        emit QuestStarted(msg.sender, questId, currentWeather);
    }
    
    function completeQuest(uint256 questId) external {
        PlayerQuest storage playerQuest = playerQuests[msg.sender][questId];
        require(playerQuest.startTime > 0, "Quest not started");
        require(!playerQuest.completed, "Quest already completed");
        require(quests[questId].active, "Quest not active");
        
        // Verify quest was started and enough time has passed
        require(block.timestamp >= playerQuest.startTime + 30, "Quest too quick (min 30 seconds)");
        
        // Mark quest as completed
        playerQuest.completed = true;
        playerQuest.completedTime = block.timestamp;
        
        // Update stats
        quests[questId].completions++;
        playerCompletedQuests[msg.sender].push(questId);
        
        // Award XP based on difficulty
        uint256 xpReward = quests[questId].difficulty * 10;
        playerXP[msg.sender] += xpReward;
        
        // Award token reward
        uint256 tokenReward = quests[questId].reward;
        require(weatherToken.transfer(msg.sender, tokenReward), "Token transfer failed");
        
        emit QuestCompleted(msg.sender, questId, tokenReward);
    }
    
    function getAvailableQuests() external view returns (uint256[] memory) {
        // Count matching quests (including universal quests)
        uint256 count = 0;
        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].active && 
                (quests[i].requiredWeather == currentWeather || quests[i].requiredWeather == 6)) {
                count++;
            }
        }
        
        // Build array of available quest IDs
        uint256[] memory availableQuests = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].active && 
                (quests[i].requiredWeather == currentWeather || quests[i].requiredWeather == 6)) {
                availableQuests[index] = i;
                index++;
            }
        }
        
        return availableQuests;
    }
    
    function getAllQuests() external view returns (uint256[] memory) {
        uint256[] memory allQuests = new uint256[](questCounter);
        for (uint256 i = 1; i <= questCounter; i++) {
            allQuests[i-1] = i;
        }
        return allQuests;
    }
    
    function getQuestDetails(uint256 questId) external view returns (
        uint8 requiredWeather,
        uint256 reward, 
        uint256 difficulty,
        bool active,
        uint256 completions,
        string memory description
    ) {
        Quest memory quest = quests[questId];
        return (
            quest.requiredWeather,
            quest.reward,
            quest.difficulty, 
            quest.active,
            quest.completions,
            quest.description
        );
    }
    
    function getPlayerStats(address player) external view returns (
        uint256 totalQuests,
        uint256 totalXP,
        uint256[] memory completedQuestIds
    ) {
        return (
            playerCompletedQuests[player].length,
            playerXP[player],
            playerCompletedQuests[player]
        );
    }
    
    function isQuestStarted(address player, uint256 questId) external view returns (bool) {
        return playerQuests[player][questId].startTime > 0;
    }
    
    function isQuestCompleted(address player, uint256 questId) external view returns (bool) {
        return playerQuests[player][questId].completed;
    }
    
    function getCurrentWeather() external view returns (uint8) {
        return currentWeather;
    }
    
    // Admin functions (for testing and management)
    function createQuest(
        uint8 requiredWeather,
        uint256 reward,
        uint256 difficulty,
        string memory description
    ) external validWeather(requiredWeather) {
        // In production, add access control here
        _createQuest(requiredWeather, reward, difficulty, description);
    }
    
    function toggleQuestActive(uint256 questId) external {
        // In production, add access control here
        require(questId <= questCounter, "Quest does not exist");
        quests[questId].active = !quests[questId].active;
    }
    
    function getTotalQuests() external view returns (uint256) {
        return questCounter;
    }
    
    // Function to fund the contract with tokens for rewards
    function fundContract(uint256 amount) external {
        require(weatherToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
    
    // Get contract token balance
    function getContractBalance() external view returns (uint256) {
        return weatherToken.balanceOf(address(this));
    }
}