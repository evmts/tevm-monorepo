// SPDX-License-Identifier: MIT
pragma solidity >0.8.16;

import {ComprehensiveContract} from "./ComprehensiveContract.sol";

/// @title ExtendedContract
/// @notice First contract - extends ComprehensiveContract (inheritance pattern)
contract ExtendedContract is ComprehensiveContract {
    uint256 public bonusMultiplier;

    event BonusApplied(address indexed user, uint256 bonus);

    constructor(
        string memory name,
        string memory symbol,
        uint256 rewardPercentage,
        uint256 _bonusMultiplier
    ) ComprehensiveContract(name, symbol, rewardPercentage) {
        bonusMultiplier = _bonusMultiplier;
    }

    /// @notice Calculate reward with bonus multiplier
    /// @param user User address
    /// @return Enhanced reward with bonus
    function calculateRewardWithBonus(address user) public view returns (uint256) {
        uint256 baseReward = calculateReward(user);
        return baseReward * bonusMultiplier;
    }

    /// @notice Claim reward with bonus
    function claimRewardWithBonus() external {
        uint256 reward = calculateRewardWithBonus(msg.sender);
        require(reward > 0, "No reward to claim");

        stakes[msg.sender] = 0;
        _mint(msg.sender, reward);

        emit BonusApplied(msg.sender, reward);
    }

    /// @notice Set bonus multiplier (only owner)
    function setBonusMultiplier(uint256 newMultiplier) external onlyOwner {
        bonusMultiplier = newMultiplier;
    }
}

/// @title WrapperContract
/// @notice Second contract - uses ComprehensiveContract (composition pattern)
contract WrapperContract {
    ComprehensiveContract public immutable underlying;
    mapping(address => bool) public isPremiumUser;

    event PremiumStatusChanged(address indexed user, bool status);
    event StakedViaWrapper(address indexed user, uint256 amount);

    constructor(address _underlyingContract) {
        underlying = ComprehensiveContract(_underlyingContract);
    }

    /// @notice Set premium user status
    function setPremiumUser(address user, bool status) external {
        isPremiumUser[user] = status;
        emit PremiumStatusChanged(user, status);
    }

    /// @notice Stake through wrapper with premium user benefits
    function stakeWithPremium(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");

        // Premium users get double stake credit
        uint256 creditAmount = isPremiumUser[msg.sender] ? amount * 2 : amount;

        // Forward to underlying contract
        underlying.stake(creditAmount);

        emit StakedViaWrapper(msg.sender, creditAmount);
    }

    /// @notice Get reward info from underlying contract
    function getRewardInfo(address user) external view returns (uint256) {
        return underlying.calculateReward(user);
    }

    /// @notice Check if user can claim rewards
    function canClaimReward(address user) external view returns (bool) {
        return underlying.calculateReward(user) > 0;
    }
}
