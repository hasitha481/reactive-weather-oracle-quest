// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleWeatherOracle is Ownable {
    enum WeatherType { CLEAR, STORM, FOG, RAIN, SNOW, AURORA, SANDSTORM, TORNADO, ECLIPSE }

    struct WeatherZone {
        WeatherType currentWeather;
        uint256 intensity;
        uint256 lastUpdate;
        uint256 voteCount;
        mapping(WeatherType => uint256) weatherVotes;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => WeatherZone) public zones;
    uint256 public totalActiveZones = 3;
    mapping(WeatherType => uint256) public rewardMultipliers;
    
    event WeatherChanged(uint256 indexed zoneId, WeatherType newWeather, uint256 intensity, address triggeredBy, uint256 rewardMultiplier);
    event WeatherVoteCast(address indexed voter, uint256 indexed zoneId, WeatherType votedWeather, uint256 currentVotes);

    constructor() {
        rewardMultipliers[WeatherType.CLEAR] = 100;
        rewardMultipliers[WeatherType.STORM] = 180;
        rewardMultipliers[WeatherType.AURORA] = 250;
        rewardMultipliers[WeatherType.ECLIPSE] = 1000;

        for (uint256 i = 0; i < totalActiveZones; i++) {
            zones[i].currentWeather = WeatherType.CLEAR;
            zones[i].intensity = 5;
            zones[i].lastUpdate = block.timestamp;
        }
    }

    function voteForWeather(uint256 zoneId, WeatherType weatherChoice) external {
        require(zoneId < totalActiveZones, "Invalid zone");
        require(!zones[zoneId].hasVoted[msg.sender], "Already voted");

        WeatherZone storage zone = zones[zoneId];
        zone.hasVoted[msg.sender] = true;
        zone.weatherVotes[weatherChoice]++;
        zone.voteCount++;

        emit WeatherVoteCast(msg.sender, zoneId, weatherChoice, zone.voteCount);

        if (zone.voteCount >= 3) {
            WeatherType newWeather = WeatherType(uint256(weatherChoice));
            zone.currentWeather = newWeather;
            zone.intensity = 5 + (uint256(newWeather) % 5);
            zone.lastUpdate = block.timestamp;
            zone.voteCount = 0;
            emit WeatherChanged(zoneId, newWeather, zone.intensity, msg.sender, rewardMultipliers[newWeather]);
        }
    }

    function getWeatherData(uint256 zoneId) external view returns (WeatherType currentWeather, uint256 intensity, uint256 timeRemaining, uint256 rewardMultiplier, uint256 voteCount, bool votingOpen) {
        require(zoneId < totalActiveZones, "Invalid zone");
        WeatherZone storage zone = zones[zoneId];
        return (zone.currentWeather, zone.intensity, 600, rewardMultipliers[zone.currentWeather], zone.voteCount, true);
    }

    function addWeatherZone() external onlyOwner {
        totalActiveZones++;
    }
}
