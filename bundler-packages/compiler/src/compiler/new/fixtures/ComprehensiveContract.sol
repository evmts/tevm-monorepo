// SPDX-License-Identifier: MIT
pragma solidity >0.8.16;

// Import from OpenZeppelin (external npm package)
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

// Import from local lib (tests lib imports and remappings)
import {MathUtils} from "utils/MathUtils.sol";

/// @author Tevm
/// @title ComprehensiveContract
/// @notice A comprehensive test contract that imports from OpenZeppelin and local libs
contract ComprehensiveContract is ERC20, Ownable {
    using MathUtils for uint256;

    uint256 public rewardPercentage;
    mapping(address => uint256) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Rewarded(address indexed user, uint256 reward);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _rewardPercentage
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_rewardPercentage <= 100, "Percentage must be <= 100");
        rewardPercentage = _rewardPercentage;
    }

    /// @notice Mint tokens to an address (only owner)
    /// @param to Address to mint to
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Stake tokens to earn rewards
    /// @param amount Amount to stake
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender] = MathUtils.add(stakes[msg.sender], amount);

        emit Staked(msg.sender, amount);
    }

    /// @notice Calculate reward for a user's stake using local lib
    /// @param user User address
    /// @return reward Calculated reward
    function calculateReward(address user) public view returns (uint256 reward) {
        uint256 stakeAmount = stakes[user];
        reward = MathUtils.percentage(stakeAmount, rewardPercentage);
    }

    /// @notice Claim rewards using OpenZeppelin's Math library
    function claimReward() external {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No reward to claim");

        // Using OpenZeppelin's Math library
        uint256 maxReward = Math.min(reward, balanceOf(address(this)));

        stakes[msg.sender] = 0;
        _transfer(address(this), msg.sender, maxReward);

        emit Rewarded(msg.sender, maxReward);
    }

    /// @notice Update reward percentage (only owner)
    /// @param newPercentage New reward percentage
    function setRewardPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 100, "Percentage must be <= 100");
        rewardPercentage = newPercentage;
    }
}
