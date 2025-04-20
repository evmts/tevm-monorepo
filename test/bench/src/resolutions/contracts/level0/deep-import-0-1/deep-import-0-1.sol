// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./deep-import-0-1-0/deep-import-0-1-0.sol";
import "./deep-import-0-1-1/deep-import-0-1-1.sol";

/**
 * @title deep-import-0-1
 * @dev A substantial governance and staking contract for benchmarking
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract DeepImport01 {
    // ============ Events ============
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardPaid(address indexed user, uint256 reward);
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    
    // ============ Constants ============
    uint256 private constant MIN_STAKING_PERIOD = 7 days;
    uint256 private constant REWARD_PRECISION = 1e18;
    uint256 private constant VOTING_PERIOD = 3 days;
    uint256 private constant EXECUTION_DELAY = 2 days;
    uint256 private constant EXECUTION_PERIOD = 3 days;
    uint256 private constant PROPOSAL_THRESHOLD = 100 * 1e18; // 100 tokens
    uint256 private constant QUORUM = 1000 * 1e18; // 1000 tokens
    
    // ============ Structs ============
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardUpdateTime;
        uint256 rewardDebt;
    }
    
    struct Proposal {
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
        string description;
        mapping(address => bool) hasVoted;
    }
    
    enum ProposalState {
        Pending,
        Active,
        Defeated,
        Succeeded,
        Executed,
        Canceled,
        Expired
    }
    
    // ============ Storage ============
    mapping(address => StakeInfo) private _stakeInfo;
    mapping(address => address) private _delegates;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(uint256 => uint256)) private _checkpoints;
    mapping(address => uint256) private _numCheckpoints;
    mapping(uint256 => Proposal) private _proposals;
    
    address private _token;
    address private _owner;
    uint256 private _totalStaked;
    uint256 private _rewardRate;
    uint256 private _lastRewardUpdateTime;
    uint256 private _proposalCount;
    uint256 private _totalRewardsDistributed;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(msg.sender == _owner, "Governance: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "Governance: paused");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposalId <= _proposalCount && proposalId > 0, "Governance: proposal does not exist");
        _;
    }
    
    // ============ Constructor ============
    constructor(address token_) {
        _token = token_;
        _owner = msg.sender;
        _rewardRate = 100; // 100 tokens per day per staked token
        _lastRewardUpdateTime = block.timestamp;
    }
    
    // ============ External View Functions ============
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingRewards
    ) {
        StakeInfo memory info = _stakeInfo[user];
        amount = info.amount;
        startTime = info.startTime;
        pendingRewards = _calculatePendingRewards(user);
    }
    
    function proposalState(uint256 proposalId) external view proposalExists(proposalId) returns (ProposalState) {
        Proposal storage proposal = _proposals[proposalId];
        
        if (proposal.canceled) {
            return ProposalState.Canceled;
        }
        
        if (proposal.executed) {
            return ProposalState.Executed;
        }
        
        if (block.timestamp < proposal.startTime) {
            return ProposalState.Pending;
        }
        
        if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        }
        
        if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes < QUORUM) {
            return ProposalState.Defeated;
        }
        
        if (block.timestamp > proposal.endTime + EXECUTION_DELAY + EXECUTION_PERIOD) {
            return ProposalState.Expired;
        }
        
        return ProposalState.Succeeded;
    }
    
    function getProposalDetails(uint256 proposalId) external view proposalExists(proposalId) returns (
        address proposer,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        bool canceled,
        string memory description
    ) {
        Proposal storage proposal = _proposals[proposalId];
        return (
            proposal.proposer,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed,
            proposal.canceled,
            proposal.description
        );
    }
    
    function hasVoted(uint256 proposalId, address voter) external view proposalExists(proposalId) returns (bool) {
        return _proposals[proposalId].hasVoted[voter];
    }
    
    function getVotingPower(address account) external view returns (uint256) {
        return _getVotingPower(account);
    }
    
    function delegates(address account) external view returns (address) {
        return _delegates[account];
    }
    
    function getCurrentVotes(address account) external view returns (uint256) {
        uint256 nCheckpoints = _numCheckpoints[account];
        return nCheckpoints > 0 ? _checkpoints[account][nCheckpoints - 1] : 0;
    }
    
    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint256) {
        require(blockNumber < block.number, "Governance: not yet determined");
        
        uint256 nCheckpoints = _numCheckpoints[account];
        if (nCheckpoints == 0) return 0;
        
        // Binary search for the checkpoint
        uint256 lower = 0;
        uint256 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint256 center = upper - (upper - lower) / 2;
            if (_checkpoints[account][center] > blockNumber) {
                upper = center - 1;
            } else {
                lower = center;
            }
        }
        return _checkpoints[account][lower];
    }
    
    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }
    
    function rewardRate() external view returns (uint256) {
        return _rewardRate;
    }
    
    function proposalThreshold() external pure returns (uint256) {
        return PROPOSAL_THRESHOLD;
    }
    
    function quorum() external pure returns (uint256) {
        return QUORUM;
    }
    
    // ============ Public/External Mutative Functions ============
    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Governance: cannot stake 0");
        
        // Update rewards
        uint256 pendingReward = _calculatePendingRewards(msg.sender);
        if (pendingReward > 0) {
            _payReward(msg.sender, pendingReward);
        }
        
        // Update stake info
        StakeInfo storage info = _stakeInfo[msg.sender];
        if (info.amount == 0) {
            info.startTime = block.timestamp;
        }
        info.amount += amount;
        info.lastRewardUpdateTime = block.timestamp;
        
        // Transfer tokens
        // Note: In real contract we would do a transferFrom here
        // but for this example we just update the balance
        _balances[msg.sender] += amount;
        _totalStaked += amount;
        
        // Update voting power
        _moveDelegates(address(0), _delegates[msg.sender], amount);
        
        emit Staked(msg.sender, amount, block.timestamp);
    }
    
    function unstake(uint256 amount) external {
        StakeInfo storage info = _stakeInfo[msg.sender];
        require(info.amount >= amount, "Governance: insufficient stake");
        require(block.timestamp >= info.startTime + MIN_STAKING_PERIOD, "Governance: minimum staking period not met");
        
        // Update rewards
        uint256 pendingReward = _calculatePendingRewards(msg.sender);
        if (pendingReward > 0) {
            _payReward(msg.sender, pendingReward);
        }
        
        // Update stake info
        info.amount -= amount;
        info.lastRewardUpdateTime = block.timestamp;
        
        // Transfer tokens
        // Note: In real contract we would do a transfer here
        // but for this example we just update the balance
        _balances[msg.sender] -= amount;
        _totalStaked -= amount;
        
        // Update voting power
        _moveDelegates(_delegates[msg.sender], address(0), amount);
        
        emit Unstaked(msg.sender, amount, block.timestamp);
    }
    
    function claimRewards() external {
        uint256 pendingReward = _calculatePendingRewards(msg.sender);
        require(pendingReward > 0, "Governance: no rewards to claim");
        
        // Update stake info
        _stakeInfo[msg.sender].lastRewardUpdateTime = block.timestamp;
        
        // Pay reward
        _payReward(msg.sender, pendingReward);
    }
    
    function delegate(address delegatee) external {
        address currentDelegate = _delegates[msg.sender];
        uint256 userBalance = _stakeInfo[msg.sender].amount;
        
        _delegates[msg.sender] = delegatee;
        
        _moveDelegates(currentDelegate, delegatee, userBalance);
        
        emit DelegateChanged(msg.sender, currentDelegate, delegatee);
    }
    
    function createProposal(string calldata description) external returns (uint256) {
        require(_getVotingPower(msg.sender) >= PROPOSAL_THRESHOLD, "Governance: below proposal threshold");
        
        _proposalCount++;
        Proposal storage newProposal = _proposals[_proposalCount];
        newProposal.proposer = msg.sender;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.description = description;
        
        emit ProposalCreated(_proposalCount, msg.sender, description);
        
        return _proposalCount;
    }
    
    function castVote(uint256 proposalId, bool support) external proposalExists(proposalId) {
        Proposal storage proposal = _proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Governance: voting not started");
        require(block.timestamp <= proposal.endTime, "Governance: voting ended");
        require(!proposal.hasVoted[msg.sender], "Governance: already voted");
        
        proposal.hasVoted[msg.sender] = true;
        
        uint256 votes = _getVotingPower(msg.sender);
        require(votes > 0, "Governance: no voting power");
        
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }
        
        emit VoteCast(msg.sender, proposalId, support, votes);
    }
    
    function executeProposal(uint256 proposalId) external proposalExists(proposalId) {
        require(this.proposalState(proposalId) == ProposalState.Succeeded, "Governance: proposal not in succeeded state");
        
        Proposal storage proposal = _proposals[proposalId];
        proposal.executed = true;
        
        // In a real contract, this would execute the proposal actions
        
        emit ProposalExecuted(proposalId);
    }
    
    function cancelProposal(uint256 proposalId) external proposalExists(proposalId) {
        Proposal storage proposal = _proposals[proposalId];
        
        require(msg.sender == proposal.proposer, "Governance: only proposer can cancel");
        require(!proposal.executed, "Governance: proposal already executed");
        require(!proposal.canceled, "Governance: proposal already canceled");
        
        proposal.canceled = true;
        
        emit ProposalCanceled(proposalId);
    }
    
    // ============ Admin Functions ============
    function setRewardRate(uint256 newRate) external onlyOwner {
        uint256 oldRate = _rewardRate;
        _rewardRate = newRate;
        _lastRewardUpdateTime = block.timestamp;
        
        emit RewardRateUpdated(oldRate, newRate);
    }
    
    function pause() external onlyOwner {
        _paused = true;
    }
    
    function unpause() external onlyOwner {
        _paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Governance: new owner is the zero address");
        _owner = newOwner;
    }
    
    // ============ Internal Functions ============
    function _calculatePendingRewards(address user) internal view returns (uint256) {
        StakeInfo memory info = _stakeInfo[user];
        
        if (info.amount == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - info.lastRewardUpdateTime;
        return (info.amount * _rewardRate * timeElapsed) / (REWARD_PRECISION * 1 days);
    }
    
    function _payReward(address user, uint256 amount) internal {
        // In a real contract, we would transfer tokens here
        // but for this example we just update the balance
        _balances[user] += amount;
        _totalRewardsDistributed += amount;
        
        emit RewardPaid(user, amount);
    }
    
    function _getVotingPower(address account) internal view returns (uint256) {
        address currentDelegate = _delegates[account];
        if (currentDelegate == address(0)) {
            return _stakeInfo[account].amount;
        } else {
            uint256 nCheckpoints = _numCheckpoints[currentDelegate];
            return nCheckpoints > 0 ? _checkpoints[currentDelegate][nCheckpoints - 1] : 0;
        }
    }
    
    function _moveDelegates(address srcRep, address dstRep, uint256 amount) internal {
        if (srcRep != dstRep && amount > 0) {
            if (srcRep != address(0)) {
                uint256 srcRepNum = _numCheckpoints[srcRep];
                uint256 srcRepOld = srcRepNum > 0 ? _checkpoints[srcRep][srcRepNum - 1] : 0;
                uint256 srcRepNew = srcRepOld - amount;
                _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
            }
            
            if (dstRep != address(0)) {
                uint256 dstRepNum = _numCheckpoints[dstRep];
                uint256 dstRepOld = dstRepNum > 0 ? _checkpoints[dstRep][dstRepNum - 1] : 0;
                uint256 dstRepNew = dstRepOld + amount;
                _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
            }
        }
    }
    
    function _writeCheckpoint(address delegatee, uint256 nCheckpoints, uint256 oldVotes, uint256 newVotes) internal {
        if (nCheckpoints > 0 && _checkpoints[delegatee][nCheckpoints - 1] == block.number) {
            _checkpoints[delegatee][nCheckpoints - 1] = newVotes;
        } else {
            _checkpoints[delegatee][nCheckpoints] = newVotes;
            _numCheckpoints[delegatee] = nCheckpoints + 1;
        }
    }
    
    // Complex computation examples
    function calculateVotingWeight(uint256 stakedAmount, uint256 stakingDuration) public pure returns (uint256) {
        require(stakedAmount > 0, "Governance: amount must be positive");
        require(stakingDuration >= MIN_STAKING_PERIOD, "Governance: duration too short");
        
        // Base weight is the staked amount
        uint256 weight = stakedAmount;
        
        // Add bonus for longer staking - up to 50% bonus for 1 year staking
        if (stakingDuration > 365 days) {
            stakingDuration = 365 days; // Cap at 1 year
        }
        
        // Calculate bonus - linear increase from 0% to 50% over one year
        uint256 bonus = (weight * stakingDuration * 50) / (365 days * 100);
        weight += bonus;
        
        // Apply diminishing returns for large amounts
        if (weight > 10000 * REWARD_PRECISION) {
            uint256 excess = weight - 10000 * REWARD_PRECISION;
            excess = (excess * 80) / 100; // 80% of value beyond threshold
            weight = 10000 * REWARD_PRECISION + excess;
        }
        
        return weight;
    }
    
    function simulateProposalOutcome(
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        uint256 totalVotingPower
    ) public pure returns (bool passed, uint256 supportPercent, uint256 quorumPercent) {
        // Calculate total participation
        uint256 totalParticipation = forVotes + againstVotes + abstainVotes;
        
        // Calculate support percentage (of non-abstaining votes)
        if (forVotes + againstVotes == 0) {
            supportPercent = 0;
        } else {
            supportPercent = (forVotes * 100) / (forVotes + againstVotes);
        }
        
        // Calculate quorum percentage
        quorumPercent = (totalParticipation * 100) / totalVotingPower;
        
        // Proposal passes if it has >50% support and meets quorum threshold
        passed = (supportPercent > 50) && (quorumPercent >= 40); // 40% quorum threshold
        
        return (passed, supportPercent, quorumPercent);
    }
}