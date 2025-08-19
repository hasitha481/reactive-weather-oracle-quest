// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiplayerSyncFixed {
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
    
    // Community voting structure (mappings moved outside)
    struct WeatherVote {
        uint256 voteId;
        uint256 proposedWeather;
        uint256 voteCount;
        uint256 startTime;
        uint256 endTime;
        bool executed;
    }
    
    // Cooperative quest structure (mappings moved outside)
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
    }

    // Achievement structure
    struct Achievement {
        uint256 achievementId;
        string name;
        string description;
        uint256 requirement;
    }
    
    // State variables
    mapping(address => Player) public players;
    mapping(uint256 => WeatherVote) public weatherVotes;
    mapping(uint256 => CoopQuest) public coopQuests;
    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;

    // Fixed: Mappings moved outside structs
    mapping(uint256 => mapping(address => bool)) public voteHasVoted;
    mapping(uint256 => mapping(address => uint256)) public voteVotingPower;
    mapping(uint256 => mapping(address => bool)) public questHasJoined;

    address[] public activePlayersList;
    uint256 public currentVoteId;
    uint256 public currentQuestId;
    uint256 public currentAchievementId;

    // External contracts
    address public weatherOracle;
    address public weatherToken;
    address public weatherNFT;

    // Events
    event PlayerRegistered(address indexed player, string username);
    event WeatherVoteCreated(uint256 indexed voteId, uint256 proposedWeather);
    event VoteCast(uint256 indexed voteId, address indexed voter);
    event WeatherVoteExecuted(uint256 indexed voteId, uint256 newWeather);
    event CoopQuestCreated(uint256 indexed questId, string name);
    event PlayerJoinedQuest(uint256 indexed questId, address indexed player);
    event CoopQuestCompleted(uint256 indexed questId);

    constructor(
        address _weatherOracle,
        address _weatherToken,
        address _weatherNFT
    ) {
        weatherOracle = _weatherOracle;
        weatherToken = _weatherToken;
        weatherNFT = _weatherNFT;
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
        emit PlayerRegistered(msg.sender, _username);
    }

    function updatePlayerStats(
        address _player,
        uint256 _experienceGained,
        bool _questCompleted
    ) external {
        require(players[_player].isActive, "Player not registered");
        
        players[_player].experience += _experienceGained;
        players[_player].lastActiveTime = block.timestamp;
        
        if (_questCompleted) {
            players[_player].questsCompleted += 1;
        }
        
        // Level up logic (every 1000 XP)
        uint256 newLevel = (players[_player].experience / 1000) + 1;
        if (newLevel > players[_player].level) {
            players[_player].level = newLevel;
        }
    }

    // Community weather voting
    function createWeatherVote(uint256 _proposedWeather) external {
        require(players[msg.sender].isActive, "Must be registered player");
        require(_proposedWeather <= 4, "Invalid weather type");
        
        currentVoteId++;
        
        weatherVotes[currentVoteId] = WeatherVote({
            voteId: currentVoteId,
            proposedWeather: _proposedWeather,
            voteCount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + 1800, // 30 minutes
            executed: false
        });
        
        emit WeatherVoteCreated(currentVoteId, _proposedWeather);
    }

    function voteForWeather(uint256 _voteId) external {
        require(players[msg.sender].isActive, "Must be registered player");
        require(weatherVotes[_voteId].voteId != 0, "Vote does not exist");
        require(block.timestamp <= weatherVotes[_voteId].endTime, "Voting period ended");
        require(!voteHasVoted[_voteId][msg.sender], "Already voted");
        
        voteHasVoted[_voteId][msg.sender] = true;
        uint256 votingPower = players[msg.sender].level;
        voteVotingPower[_voteId][msg.sender] = votingPower;
        weatherVotes[_voteId].voteCount += votingPower;
        
        emit VoteCast(_voteId, msg.sender);
    }

    // Simplified functions for demo
    function getPlayerCount() external view returns (uint256) {
        return activePlayersList.length;
    }

    function getPlayer(address _player) external view returns (Player memory) {
        return players[_player];
    }
}
