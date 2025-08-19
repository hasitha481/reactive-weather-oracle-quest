// ================================================
// FILE: contracts/WeatherToken.sol  
// PURPOSE: $WEATHER token with staking rewards for grant demo
// ================================================

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract WeatherToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    struct StakeInfo {
        uint256 amount;           // Staked amount
        uint256 timestamp;        // Stake start time
        uint256 lockPeriod;       // Lock duration in seconds
        uint256 multiplier;       // Reward multiplier (100 = 1x)
        uint256 lastClaim;        // Last reward claim
        bool isActive;            // Stake status
    }

    struct WeatherReward {
        uint256 baseReward;       // Base tokens per quest
        uint256 multiplier;       // Weather type multiplier
        uint256 streakBonus;      // Consecutive weather bonus
    }

    // Constants for grant demo
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant STAKING_REWARDS_POOL = 200_000_000 * 10**18; // 20% for staking
    uint256 public constant QUEST_REWARDS_POOL = 300_000_000 * 10**18; // 30% for quests
    
    // State variables
    mapping(address => StakeInfo[]) public userStakes;
    mapping(address => uint256) public totalStaked;
    mapping(address => uint256) public weatherStreak;
    mapping(address => uint256) public lastWeatherInteraction;
    
    uint256 public totalStakedAmount;
    uint256 public rewardsDistributed;
    uint256 public currentAPY = 1200; // 12% base APY
    
    // Weather integration
    address public weatherOracle;
    mapping(uint256 => WeatherReward) public weatherRewards;
    mapping(address => mapping(uint256 => uint256)) public weatherExposure;
    
    // Events for grant demo
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 multiplier);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    event WeatherRewardClaimed(address indexed user, uint256 amount, uint256 weatherType);

    constructor() ERC20("Weather Token", "WEATHER") {
        _mint(msg.sender, MAX_SUPPLY);
        _initializeWeatherRewards();
    }

    function _initializeWeatherRewards() private {
        // Set base rewards for different weather types (GRANT SHOWCASE)
        weatherRewards[0] = WeatherReward(10 * 10**18, 100, 0);  // CLEAR - 10 tokens, 1x
        weatherRewards[1] = WeatherReward(18 * 10**18, 180, 5 * 10**18);  // STORM - 18 tokens, 1.8x
        weatherRewards[2] = WeatherReward(13 * 10**18, 130, 3 * 10**18);  // FOG - 13 tokens, 1.3x
        weatherRewards[3] = WeatherReward(12 * 10**18, 120, 2 * 10**18);  // RAIN - 12 tokens, 1.2x
        weatherRewards[4] = WeatherReward(14 * 10**18, 140, 4 * 10**18);  // SNOW - 14 tokens, 1.4x
        weatherRewards[5] = WeatherReward(25 * 10**18, 250, 10 * 10**18); // AURORA - 25 tokens, 2.5x
        weatherRewards[6] = WeatherReward(30 * 10**18, 300, 15 * 10**18); // SANDSTORM - 30 tokens, 3x
        weatherRewards[7] = WeatherReward(50 * 10**18, 500, 25 * 10**18); // TORNADO - 50 tokens, 5x
        weatherRewards[8] = WeatherReward(100 * 10**18, 1000, 50 * 10**18); // ECLIPSE - 100 tokens, 10x
    }

    /**
     * @dev Stake tokens with different lock periods - GRANT DEFI FEATURE
     * @param amount Amount to stake
     * @param lockPeriod Lock period in seconds (30 days = 2592000)
     */
    function stakeTokens(uint256 amount, uint256 lockPeriod) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(lockPeriod >= 30 days, "Minimum lock period is 30 days");

        // Calculate multiplier based on lock period (GRANT INCENTIVE DESIGN)
        uint256 multiplier = _calculateStakingMultiplier(lockPeriod);
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Create stake record
        userStakes[msg.sender].push(StakeInfo({
            amount: amount,
            timestamp: block.timestamp,
            lockPeriod: lockPeriod,
            multiplier: multiplier,
            lastClaim: block.timestamp,
            isActive: true
        }));

        totalStaked[msg.sender] += amount;
        totalStakedAmount += amount;

        emit Staked(msg.sender, amount, lockPeriod, multiplier);
    }

    /**
     * @dev Claim staking rewards - SHOWCASES CONTINUOUS REWARDS
     * @param stakeIndex Index of the stake to claim rewards for
     */
    function claimStakingRewards(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        StakeInfo storage stake = userStakes[msg.sender][stakeIndex];
        require(stake.isActive, "Stake is not active");

        uint256 rewards = _calculateStakingRewards(msg.sender, stakeIndex);
        require(rewards > 0, "No rewards available");

        stake.lastClaim = block.timestamp;
        rewardsDistributed += rewards;

        // Mint rewards (DEMONSTRATES TOKEN ECONOMICS)
        _mint(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Unstake tokens after lock period
     * @param stakeIndex Index of stake to unstake
     */
    function unstakeTokens(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        StakeInfo storage stake = userStakes[msg.sender][stakeIndex];
        require(stake.isActive, "Stake already unstaked");
        require(
            block.timestamp >= stake.timestamp + stake.lockPeriod,
            "Tokens still locked"
        );

        uint256 stakedAmount = stake.amount;
        uint256 rewards = _calculateStakingRewards(msg.sender, stakeIndex);

        // Update state
        stake.isActive = false;
        totalStaked[msg.sender] -= stakedAmount;
        totalStakedAmount -= stakedAmount;
        rewardsDistributed += rewards;

        // Transfer staked tokens back
        _transfer(address(this), msg.sender, stakedAmount);
        
        // Mint rewards
        if (rewards > 0) {
            _mint(msg.sender, rewards);
        }

        emit Unstaked(msg.sender, stakedAmount, rewards);
    }

    /**
     * @dev Claim quest rewards based on weather - MAIN GRANT FEATURE
     * @param weatherType Current weather type (0-8)
     * @param questDifficulty Difficulty multiplier (100-500)
     */
    function claimQuestReward(
        uint256 weatherType, 
        uint256 questDifficulty,
        bool isCooperative
    ) external nonReentrant {
        require(weatherType <= 8, "Invalid weather type");
        require(questDifficulty >= 100 && questDifficulty <= 500, "Invalid difficulty");
        require(msg.sender == weatherOracle || msg.sender == owner(), "Only oracle or owner");

        WeatherReward memory reward = weatherRewards[weatherType];
        uint256 baseAmount = reward.baseReward;
        
        // Apply difficulty multiplier (GRANT SHOWCASE: DYNAMIC REWARDS)
        uint256 totalReward = (baseAmount * questDifficulty) / 100;
        
        // Apply weather multiplier
        totalReward = (totalReward * reward.multiplier) / 100;
        
        // Add streak bonus (GRANT FEATURE: PLAYER RETENTION)
        if (_isWeatherStreak(tx.origin, weatherType)) {
            totalReward += reward.streakBonus;
            weatherStreak[tx.origin]++;
        } else {
            weatherStreak[tx.origin] = 1;
        }
        
        // Add cooperative bonus (GRANT FEATURE: SOCIAL GAMING)
        if (isCooperative) {
            totalReward += (totalReward * 20) / 100; // 20% bonus for cooperation
        }
        
        // Update weather exposure (GRANT FEATURE: PROGRESSION TRACKING)
        weatherExposure[tx.origin][weatherType]++;
        lastWeatherInteraction[tx.origin] = block.timestamp;

        // Mint reward tokens
        _mint(tx.origin, totalReward);

        emit WeatherRewardClaimed(tx.origin, totalReward, weatherType);
    }

    /**
     * @dev Calculate staking rewards for grant demo
     */
    function _calculateStakingRewards(address user, uint256 stakeIndex) private view returns (uint256) {
        StakeInfo storage stake = userStakes[user][stakeIndex];
        if (!stake.isActive) return 0;

        uint256 timeStaked = block.timestamp - stake.lastClaim;
        uint256 baseReward = (stake.amount * currentAPY * timeStaked) / (365 days * 10000);
        
        // Apply multiplier (SHOWCASES LOCK PERIOD INCENTIVES)
        uint256 multipliedReward = (baseReward * stake.multiplier) / 100;
        
        return multipliedReward;
    }

    /**
     * @dev Calculate staking multiplier based on lock period
     */
    function _calculateStakingMultiplier(uint256 lockPeriod) private pure returns (uint256) {
        if (lockPeriod >= 365 days) return 300; // 3x for 1 year+
        if (lockPeriod >= 180 days) return 200; // 2x for 6 months+
        if (lockPeriod >= 90 days) return 150;  // 1.5x for 3 months+
        return 120; // 1.2x for 30+ days
    }

    /**
     * @dev Check if user has weather streak for grants
     */
    function _isWeatherStreak(address user, uint256 weatherType) private view returns (bool) {
        return block.timestamp - lastWeatherInteraction[user] <= 24 hours && 
               weatherStreak[user] > 0;
    }

    // View functions for grant demo frontend
    function getUserStakeInfo(address user) external view returns (
        uint256[] memory amounts,
        uint256[] memory timestamps,
        uint256[] memory lockPeriods,
        uint256[] memory multipliers,
        bool[] memory isActive,
        uint256[] memory pendingRewards
    ) {
        uint256 stakeCount = userStakes[user].length;
        
        amounts = new uint256[](stakeCount);
        timestamps = new uint256[](stakeCount);
        lockPeriods = new uint256[](stakeCount);
        multipliers = new uint256[](stakeCount);
        isActive = new bool[](stakeCount);
        pendingRewards = new uint256[](stakeCount);

        for (uint256 i = 0; i < stakeCount; i++) {
            StakeInfo storage stake = userStakes[user][i];
            amounts[i] = stake.amount;
            timestamps[i] = stake.timestamp;
            lockPeriods[i] = stake.lockPeriod;
            multipliers[i] = stake.multiplier;
            isActive[i] = stake.isActive;
            pendingRewards[i] = stake.isActive ? _calculateStakingRewards(user, i) : 0;
        }
    }

    function getWeatherStats(address user) external view returns (
        uint256[9] memory exposures,
        uint256 currentStreak,
        uint256 lastInteraction
    ) {
        for (uint256 i = 0; i < 9; i++) {
            exposures[i] = weatherExposure[user][i];
        }
        
        return (exposures, weatherStreak[user], lastWeatherInteraction[user]);
    }

    function getTotalStakingStats() external view returns (
        uint256 totalStakedTokens,
        uint256 totalRewardsDistributed,
        uint256 currentAPYRate,
        uint256 stakingPoolRemaining
    ) {
        return (
            totalStakedAmount,
            rewardsDistributed,
            currentAPY,
            STAKING_REWARDS_POOL - rewardsDistributed
        );
    }

    // Admin functions for grant demo
    function setWeatherOracle(address _weatherOracle) external onlyOwner {
        weatherOracle = _weatherOracle;
    }

    function updateAPY(uint256 newAPY) external onlyOwner {
        require(newAPY >= 100 && newAPY <= 5000, "APY must be between 1% and 50%");
        currentAPY = newAPY;
    }

    function updateWeatherReward(
        uint256 weatherType,
        uint256 baseReward,
        uint256 multiplier,
        uint256 streakBonus
    ) external onlyOwner {
        require(weatherType <= 8, "Invalid weather type");
        
        weatherRewards[weatherType] = WeatherReward({
            baseReward: baseReward,
            multiplier: multiplier,
            streakBonus: streakBonus
        });
    }

    function mintForDevelopment(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}