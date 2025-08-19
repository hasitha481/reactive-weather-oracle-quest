// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiplayerSyncMinimal {
    struct Player {
        address playerAddress;
        string username;
        uint256 level;
        uint256 experience;
        bool isActive;
    }
    
    mapping(address => Player) public players;
    address[] public activePlayersList;
    
    address public weatherOracle;
    address public weatherToken;
    address public weatherNFT;
    
    event PlayerRegistered(address indexed player, string username);
    
    constructor(
        address _weatherOracle,
        address _weatherToken,
        address _weatherNFT
    ) {
        weatherOracle = _weatherOracle;
        weatherToken = _weatherToken;
        weatherNFT = _weatherNFT;
    }
    
    function registerPlayer(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(!players[msg.sender].isActive, "Player already registered");
        
        players[msg.sender] = Player({
            playerAddress: msg.sender,
            username: _username,
            level: 1,
            experience: 0,
            isActive: true
        });
        
        activePlayersList.push(msg.sender);
        emit PlayerRegistered(msg.sender, _username);
    }
    
    function getPlayerCount() external view returns (uint256) {
        return activePlayersList.length;
    }
    
    function getPlayer(address _player) external view returns (Player memory) {
        return players[_player];
    }
}