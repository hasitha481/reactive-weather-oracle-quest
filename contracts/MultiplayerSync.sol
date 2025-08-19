// SPDX-License-Identifier: MIT
// FILE: contracts/MultiplayerSync.sol - FIXED VERSION
pragma solidity ^0.8.20;

contract MultiplayerSync {
    // Player data structure
    struct Player {
        address playerAddress;
        string username;
        uint256 level;
        uint256 experience;
        uint256 questsCompleted;
        uint256 lastActiveTime;
        bool isActive;
    }
    
    // Community voting structure
    struct WeatherVote {
        uint256 voteId;
        uint256 proposedWeather; // 0=Storm, 1=Sunshine, 2=Fog, 3=Rain, 4=Snow
        uint256 voteCount;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votingPower;
    }
    
    // Cooperative quest structure
    struct CoopQuest {
        uint256 questId;
        string name;
        string description;
        uint256 requiredWeather;
        uint256 maxParticipants;
        uint256 currentParticipants;
        uint256 rewardPerPlayer;
        uint256 startTime;
        uint256 duration;
        bool completed;
        address[] participants;
        mapping(address => bool) hasJoined;
    }
    
    // Achievement structure
    struct Achievement {
        uint256 achievementId;
        string name;
        string description;
        uint256 requirement;
        uint256 rewardAmount;
        bool isActive;
    }
    
    // State variables
    mapping(address => Player) public players;
    mapping(uint256 => WeatherVote) public weatherVotes;
    mapping(uint256 => CoopQuest) public coopQuests;
    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    
    address[] public activePlayersList;
    uint256 public currentVoteId;
    uint256 public currentQuestId;
    uint256 public currentAchievementId;
    
    // Leaderboard arrays
    address[] public levelLeaderboard;
    address[] public experienceLeaderboard;
    address[] public questLeaderboard;
    
    // External contracts (simplified for now)
    address public weatherOracle;
    address public weatherToken;
    address public weatherNFT;
    
    // Events
    event PlayerRegistered(address indexed player, string username);
    event PlayerLevelUp(address indexed player, uint256 newLevel);
    event WeatherVoteCreated(uint256 indexed voteId, uint256 proposedWeather);
    event WeatherVoteExecuted(uint256 indexed voteId, uint256 newWeather);
    event CoopQuestCreated(uint256 indexed questId, string name, uint256 maxParticipants);
    event CoopQuestJoined(uint256 indexed questId, address indexed player);
    event CoopQuestCompleted(uint256 indexed questId, address[] participants);
    event AchievementUnlocked(address indexed player, uint256 indexed achievementId);
    
    constructor(
        address _weatherOracle,
        address _weatherToken,
        address _weatherNFT
    ) {
        weatherOracle = _weatherOracle;
        weatherToken = _weatherToken;
        weatherNFT = _weatherNFT;
        
        // Initialize achievements
      //  _createInitialAchievements();
    }
    
    // Player registration and management
    function registerPlayer(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(!players[msg.sender].isActive, "Player already registered");
        
        players[msg.sender] = Player({
            playerAddress: msg.sender,
            username: _username,
            level: 1,
            experience: 0,
            questsCompleted: 0,
            lastActiveTime: block.timestamp,
            isActive: true
        });
        
        activePlayersList.push(msg.sender);
        _updateLeaderboards(msg.sender);
        
        emit PlayerRegistered(msg.sender, _username);
    }
    
    // FIXED: Function definition moved before usage
    function updatePlayerStats(
        address _player,
        uint256 _experienceGain,
        bool _questCompleted
    ) public {
        require(players[_player].isActive, "Player not registered");
        
        Player storage player = players[_player];
        player.experience += _experienceGain;
        player.lastActiveTime = block.timestamp;
        
        if (_questCompleted) {
            player.questsCompleted++;
        }
        
        // Check for level up
        uint256 newLevel = _calculateLevel(player.experience);
        if (newLevel > player.level) {
            player.level = newLevel;
            emit PlayerLevelUp(_player, newLevel);
        }
        
        _updateLeaderboards(_player);
        _checkAchievements(_player);
    }
    
    // Community weather voting
    function createWeatherVote(uint256 _proposedWeather) external {
        require(players[msg.sender].isActive, "Must be registered player");
        require(players[msg.sender].level >= 3, "Must be level 3+ to create votes");
        require(_proposedWeather <= 4, "Invalid weather type");
        
        currentVoteId++;
        WeatherVote storage vote = weatherVotes[currentVoteId];
        vote.voteId = currentVoteId;
        vote.proposedWeather = _proposedWeather;
        vote.startTime = block.timestamp;
        vote.endTime = block.timestamp + 1800; // 30 minutes
        vote.executed = false;
        
        emit WeatherVoteCreated(currentVoteId, _proposedWeather);
    }
    
    function voteForWeather(uint256 _voteId) external {
        require(players[msg.sender].isActive, "Must be registered player");
        WeatherVote storage vote = weatherVotes[_voteId];
        require(block.timestamp <= vote.endTime, "Voting period ended");
        require(!vote.hasVoted[msg.sender], "Already voted");
        require(!vote.executed, "Vote already executed");
        
        uint256 votingPower = _calculateVotingPower(msg.sender);
        vote.hasVoted[msg.sender] = true;
        vote.votingPower[msg.sender] = votingPower;
        vote.voteCount += votingPower;
    }
    
    function executeWeatherVote(uint256 _voteId) external {
        WeatherVote storage vote = weatherVotes[_voteId];
        require(block.timestamp > vote.endTime, "Voting still active");
        require(!vote.executed, "Already executed");
        require(vote.voteCount >= 10, "Not enough votes");
        
        vote.executed = true;
        // Note: Would call weatherOracle.setWeather(vote.proposedWeather) in full implementation
        
        emit WeatherVoteExecuted(_voteId, vote.proposedWeather);
    }
    
    // Cooperative quests
    function createCoopQuest(
        string memory _name,
        string memory _description,
        uint256 _requiredWeather,
        uint256 _maxParticipants,
        uint256 _rewardPerPlayer,
        uint256 _duration
    ) external {
        require(players[msg.sender].isActive, "Must be registered player");
        require(_maxParticipants >= 2 && _maxParticipants <= 20, "Invalid participant count");
        require(_requiredWeather <= 4, "Invalid weather type");
        
        currentQuestId++;
        CoopQuest storage quest = coopQuests[currentQuestId];
        quest.questId = currentQuestId;
        quest.name = _name;
        quest.description = _description;
        quest.requiredWeather = _requiredWeather;
        quest.maxParticipants = _maxParticipants;
        quest.rewardPerPlayer = _rewardPerPlayer;
        quest.startTime = block.timestamp;
        quest.duration = _duration;
        quest.completed = false;
        
        emit CoopQuestCreated(currentQuestId, _name, _maxParticipants);
    }
    
    function joinCoopQuest(uint256 _questId) external {
        require(players[msg.sender].isActive, "Must be registered player");
        CoopQuest storage quest = coopQuests[_questId];
        require(!quest.completed, "Quest already completed");
        require(quest.currentParticipants < quest.maxParticipants, "Quest is full");
        require(!quest.hasJoined[msg.sender], "Already joined");
        
        quest.hasJoined[msg.sender] = true;
        quest.participants.push(msg.sender);
        quest.currentParticipants++;
        
        emit CoopQuestJoined(_questId, msg.sender);
        
        // Auto-complete if full
        if (quest.currentParticipants == quest.maxParticipants) {
            _completeCoopQuest(_questId);
        }
    }
    
    function _completeCoopQuest(uint256 _questId) internal {
        CoopQuest storage quest = coopQuests[_questId];
        quest.completed = true;
        
        // Distribute rewards to all participants
        for (uint256 i = 0; i < quest.participants.length; i++) {
            address participant = quest.participants[i];
            // Note: Would mint tokens in full implementation
            updatePlayerStats(participant, quest.rewardPerPlayer / 10, true);
        }
        
        emit CoopQuestCompleted(_questId, quest.participants);
    }
    
    // Achievement system
    function _createInitialAchievements() internal {
        achievements[1] = Achievement({
            achievementId: 1,
            name: "First Steps",
            description: "Complete your first quest",
            requirement: 1,
            rewardAmount: 100,
            isActive: true
        });
        
        achievements[2] = Achievement({
            achievementId: 2,
            name: "Weather Master",
            description: "Experience all 5 weather types",
            requirement: 5,
            rewardAmount: 500,
            isActive: true
        });
        
        achievements[3] = Achievement({
            achievementId: 3,
            name: "Social Player",
            description: "Complete 5 cooperative quests",
            requirement: 5,
            rewardAmount: 300,
            isActive: true
        });
        
        currentAchievementId = 3;
    }
    
    function _checkAchievements(address _player) internal {
        Player storage player = players[_player];
        
        // Check "First Steps" achievement
        if (player.questsCompleted >= 1 && !playerAchievements[_player][1]) {
            playerAchievements[_player][1] = true;
            emit AchievementUnlocked(_player, 1);
        }
    }
    
    // Utility functions
    function _calculateLevel(uint256 _experience) internal pure returns (uint256) {
        if (_experience < 100) return 1;
        if (_experience < 300) return 2;
        if (_experience < 600) return 3;
        if (_experience < 1000) return 4;
        if (_experience < 1500) return 5;
        return 6 + (_experience - 1500) / 500;
    }
    
    function _calculateVotingPower(address _player) internal view returns (uint256) {
        Player storage player = players[_player];
        // Simplified: voting power = level (NFT count would be added in full implementation)
        return player.level;
    }
    
    function _updateLeaderboards(address _player) internal {
        // Simplified leaderboard update
        // In full implementation, would use more efficient sorting
        Player storage player = players[_player];
        
        // Just add to leaderboards for now
        bool found = false;
        for (uint256 i = 0; i < levelLeaderboard.length; i++) {
            if (levelLeaderboard[i] == _player) {
                found = true;
                break;
            }
        }
        if (!found) {
            levelLeaderboard.push(_player);
        }
    }
    
    // View functions
    function getPlayer(address _player) external view returns (Player memory) {
        return players[_player];
    }
    
    function getActivePlayersCount() external view returns (uint256) {
        return activePlayersList.length;
    }
    
    function getCurrentVote() external view returns (
        uint256 voteId,
        uint256 proposedWeather,
        uint256 voteCount,
        uint256 endTime,
        bool executed
    ) {
        WeatherVote storage vote = weatherVotes[currentVoteId];
        return (vote.voteId, vote.proposedWeather, vote.voteCount, vote.endTime, vote.executed);
    }
    
    function getCoopQuest(uint256 _questId) external view returns (
        string memory name,
        string memory description,
        uint256 requiredWeather,
        uint256 maxParticipants,
        uint256 currentParticipants,
        uint256 rewardPerPlayer,
        bool completed
    ) {
        CoopQuest storage quest = coopQuests[_questId];
        return (
            quest.name,
            quest.description,
            quest.requiredWeather,
            quest.maxParticipants,
            quest.currentParticipants,
            quest.rewardPerPlayer,
            quest.completed
        );
    }
    
    function getLeaderboard(uint256 _type) external view returns (address[] memory) {
        if (_type == 0) return levelLeaderboard;
        if (_type == 1) return experienceLeaderboard;
        if (_type == 2) return questLeaderboard;
        return new address[](0);
    }
    
    function hasPlayerVoted(uint256 _voteId, address _player) external view returns (bool) {
        return weatherVotes[_voteId].hasVoted[_player];
    }
    
    function hasPlayerJoinedQuest(uint256 _questId, address _player) external view returns (bool) {
        return coopQuests[_questId].hasJoined[_player];
    }
}
