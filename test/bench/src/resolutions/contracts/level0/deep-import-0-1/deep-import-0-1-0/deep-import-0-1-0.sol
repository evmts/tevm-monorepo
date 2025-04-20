// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title deep-import-0-1-0
 * @dev Insurance protocol contract for benchmarking import resolution
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract DeepImport010 {
    // ============ Events ============
    event CoverPurchased(address indexed buyer, uint256 indexed coverId, uint256 premium, uint256 coverAmount, uint64 startTime, uint64 endTime);
    event ClaimSubmitted(address indexed claimant, uint256 indexed coverId, uint256 indexed claimId, uint256 amount, string evidence);
    event ClaimApproved(uint256 indexed claimId, uint256 amount, uint256 timestamp);
    event ClaimRejected(uint256 indexed claimId, string reason, uint256 timestamp);
    event ProductAdded(uint256 indexed productId, string name, string description);
    event PremiumRateUpdated(uint256 indexed productId, uint256 oldRate, uint256 newRate);
    event StakerAdded(address indexed staker, uint256 amount);
    event StakerRemoved(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 amount);
    
    // ============ Structs ============
    struct Cover {
        address owner;
        uint256 productId;
        uint256 coverAmount;
        uint256 premium;
        uint64 startTime;
        uint64 endTime;
        bool claimed;
    }
    
    struct Claim {
        address claimant;
        uint256 coverId;
        uint256 amount;
        string evidence;
        ClaimStatus status;
        uint256 timestamp;
        string rejectionReason;
    }
    
    struct Product {
        string name;
        string description;
        uint256 premiumRate; // Basis points, e.g., 100 for 1%
        bool active;
        uint256 maxCoverAmount;
        uint256 minCoverAmount;
        uint256 maxCoverPeriod;
        uint256 minCoverPeriod;
        uint256 claimsCount;
        uint256 activeCoverCount;
        uint256 totalCoverAmount;
    }
    
    struct Staker {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
    }
    
    enum ClaimStatus { Pending, Approved, Rejected }
    
    // ============ Constants ============
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant REWARD_RATE = 500; // 5% annual reward rate
    uint256 private constant SECONDS_PER_YEAR = 365 days;
    uint256 private constant MAX_CLAIM_PERIOD = 30 days;
    
    // ============ Storage ============
    mapping(uint256 => Cover) private _covers;
    mapping(uint256 => Claim) private _claims;
    mapping(uint256 => Product) private _products;
    mapping(address => Staker) private _stakers;
    mapping(address => uint256[]) private _userCovers;
    mapping(address => uint256[]) private _userClaims;
    
    uint256 private _coverCounter;
    uint256 private _claimCounter;
    uint256 private _productCounter;
    uint256 private _totalStaked;
    address private _owner;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(msg.sender == _owner, "Insurance: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "Insurance: paused");
        _;
    }
    
    modifier productExists(uint256 productId) {
        require(productId <= _productCounter && _products[productId].active, "Insurance: product does not exist");
        _;
    }
    
    modifier coverExists(uint256 coverId) {
        require(coverId <= _coverCounter, "Insurance: cover does not exist");
        _;
    }
    
    modifier claimExists(uint256 claimId) {
        require(claimId <= _claimCounter, "Insurance: claim does not exist");
        _;
    }
    
    // ============ Constructor ============
    constructor() {
        _owner = msg.sender;
    }
    
    // ============ External View Functions ============
    function getCover(uint256 coverId) external view coverExists(coverId) returns (
        address owner,
        uint256 productId,
        uint256 coverAmount,
        uint256 premium,
        uint64 startTime,
        uint64 endTime,
        bool claimed
    ) {
        Cover memory cover = _covers[coverId];
        return (
            cover.owner,
            cover.productId,
            cover.coverAmount,
            cover.premium,
            cover.startTime,
            cover.endTime,
            cover.claimed
        );
    }
    
    function getClaim(uint256 claimId) external view claimExists(claimId) returns (
        address claimant,
        uint256 coverId,
        uint256 amount,
        string memory evidence,
        ClaimStatus status,
        uint256 timestamp,
        string memory rejectionReason
    ) {
        Claim memory claim = _claims[claimId];
        return (
            claim.claimant,
            claim.coverId,
            claim.amount,
            claim.evidence,
            claim.status,
            claim.timestamp,
            claim.rejectionReason
        );
    }
    
    function getProduct(uint256 productId) external view productExists(productId) returns (
        string memory name,
        string memory description,
        uint256 premiumRate,
        uint256 maxCoverAmount,
        uint256 minCoverAmount,
        uint256 maxCoverPeriod,
        uint256 minCoverPeriod,
        uint256 claimsCount,
        uint256 activeCoverCount,
        uint256 totalCoverAmount
    ) {
        Product memory product = _products[productId];
        return (
            product.name,
            product.description,
            product.premiumRate,
            product.maxCoverAmount,
            product.minCoverAmount,
            product.maxCoverPeriod,
            product.minCoverPeriod,
            product.claimsCount,
            product.activeCoverCount,
            product.totalCoverAmount
        );
    }
    
    function getUserCovers(address user) external view returns (uint256[] memory) {
        return _userCovers[user];
    }
    
    function getUserClaims(address user) external view returns (uint256[] memory) {
        return _userClaims[user];
    }
    
    function getStakerInfo(address staker) external view returns (uint256 amount, uint256 pendingRewards) {
        Staker memory stakerInfo = _stakers[staker];
        amount = stakerInfo.amount;
        pendingRewards = _calculatePendingRewards(staker);
    }
    
    function calculatePremium(
        uint256 productId,
        uint256 coverAmount,
        uint64 startTime,
        uint64 endTime
    ) external view productExists(productId) returns (uint256) {
        return _calculatePremium(productId, coverAmount, startTime, endTime);
    }
    
    function getTotalStaked() external view returns (uint256) {
        return _totalStaked;
    }
    
    // ============ External Mutative Functions ============
    function purchaseCover(
        uint256 productId,
        uint256 coverAmount,
        uint64 startTime,
        uint64 endTime
    ) external whenNotPaused productExists(productId) returns (uint256) {
        Product storage product = _products[productId];
        
        // Validate cover parameters
        require(coverAmount >= product.minCoverAmount, "Insurance: cover amount too low");
        require(coverAmount <= product.maxCoverAmount, "Insurance: cover amount too high");
        
        uint256 coverPeriod = endTime - startTime;
        require(coverPeriod >= product.minCoverPeriod, "Insurance: cover period too short");
        require(coverPeriod <= product.maxCoverPeriod, "Insurance: cover period too long");
        
        require(startTime >= block.timestamp, "Insurance: start time in the past");
        
        // Calculate premium
        uint256 premium = _calculatePremium(productId, coverAmount, startTime, endTime);
        
        // Create cover
        _coverCounter++;
        Cover storage cover = _covers[_coverCounter];
        cover.owner = msg.sender;
        cover.productId = productId;
        cover.coverAmount = coverAmount;
        cover.premium = premium;
        cover.startTime = startTime;
        cover.endTime = endTime;
        cover.claimed = false;
        
        // Update product stats
        product.activeCoverCount++;
        product.totalCoverAmount += coverAmount;
        
        // Add to user covers
        _userCovers[msg.sender].push(_coverCounter);
        
        // Transfer premium (in real contract)
        // token.transferFrom(msg.sender, address(this), premium);
        
        emit CoverPurchased(msg.sender, _coverCounter, premium, coverAmount, startTime, endTime);
        
        return _coverCounter;
    }
    
    function submitClaim(
        uint256 coverId,
        uint256 amount,
        string calldata evidence
    ) external whenNotPaused coverExists(coverId) returns (uint256) {
        Cover storage cover = _covers[coverId];
        
        // Validate claim
        require(cover.owner == msg.sender, "Insurance: not cover owner");
        require(!cover.claimed, "Insurance: already claimed");
        require(block.timestamp >= cover.startTime, "Insurance: cover not started");
        require(block.timestamp <= cover.endTime + MAX_CLAIM_PERIOD, "Insurance: claim period expired");
        require(amount <= cover.coverAmount, "Insurance: amount exceeds cover");
        
        // Create claim
        _claimCounter++;
        Claim storage claim = _claims[_claimCounter];
        claim.claimant = msg.sender;
        claim.coverId = coverId;
        claim.amount = amount;
        claim.evidence = evidence;
        claim.status = ClaimStatus.Pending;
        claim.timestamp = block.timestamp;
        
        // Mark cover as claimed
        cover.claimed = true;
        
        // Update product stats
        _products[cover.productId].claimsCount++;
        
        // Add to user claims
        _userClaims[msg.sender].push(_claimCounter);
        
        emit ClaimSubmitted(msg.sender, coverId, _claimCounter, amount, evidence);
        
        return _claimCounter;
    }
    
    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Insurance: amount must be positive");
        
        // Update rewards
        uint256 pendingReward = _calculatePendingRewards(msg.sender);
        if (pendingReward > 0) {
            // Transfer reward (in real contract)
            // token.transfer(msg.sender, pendingReward);
            emit RewardsClaimed(msg.sender, pendingReward);
        }
        
        // Update staker info
        Staker storage stakerInfo = _stakers[msg.sender];
        stakerInfo.amount += amount;
        stakerInfo.lastUpdateTime = block.timestamp;
        
        // Update total staked
        _totalStaked += amount;
        
        // Transfer stake amount (in real contract)
        // token.transferFrom(msg.sender, address(this), amount);
        
        emit StakerAdded(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external {
        Staker storage stakerInfo = _stakers[msg.sender];
        require(stakerInfo.amount >= amount, "Insurance: insufficient stake");
        
        // Update rewards
        uint256 pendingReward = _calculatePendingRewards(msg.sender);
        if (pendingReward > 0) {
            // Transfer reward (in real contract)
            // token.transfer(msg.sender, pendingReward);
            emit RewardsClaimed(msg.sender, pendingReward);
        }
        
        // Update staker info
        stakerInfo.amount -= amount;
        stakerInfo.lastUpdateTime = block.timestamp;
        
        // Update total staked
        _totalStaked -= amount;
        
        // Transfer stake amount (in real contract)
        // token.transfer(msg.sender, amount);
        
        emit StakerRemoved(msg.sender, amount);
    }
    
    function claimRewards() external {
        uint256 pendingReward = _calculatePendingRewards(msg.sender);
        require(pendingReward > 0, "Insurance: no rewards to claim");
        
        // Update staker info
        _stakers[msg.sender].lastUpdateTime = block.timestamp;
        
        // Transfer reward (in real contract)
        // token.transfer(msg.sender, pendingReward);
        
        emit RewardsClaimed(msg.sender, pendingReward);
    }
    
    // ============ Admin Functions ============
    function addProduct(
        string calldata name,
        string calldata description,
        uint256 premiumRate,
        uint256 maxCoverAmount,
        uint256 minCoverAmount,
        uint256 maxCoverPeriod,
        uint256 minCoverPeriod
    ) external onlyOwner returns (uint256) {
        require(premiumRate > 0, "Insurance: premium rate must be positive");
        require(maxCoverAmount > minCoverAmount, "Insurance: invalid cover amount range");
        require(maxCoverPeriod > minCoverPeriod, "Insurance: invalid cover period range");
        
        _productCounter++;
        Product storage product = _products[_productCounter];
        product.name = name;
        product.description = description;
        product.premiumRate = premiumRate;
        product.active = true;
        product.maxCoverAmount = maxCoverAmount;
        product.minCoverAmount = minCoverAmount;
        product.maxCoverPeriod = maxCoverPeriod;
        product.minCoverPeriod = minCoverPeriod;
        
        emit ProductAdded(_productCounter, name, description);
        
        return _productCounter;
    }
    
    function updatePremiumRate(uint256 productId, uint256 newRate) external onlyOwner productExists(productId) {
        require(newRate > 0, "Insurance: premium rate must be positive");
        
        uint256 oldRate = _products[productId].premiumRate;
        _products[productId].premiumRate = newRate;
        
        emit PremiumRateUpdated(productId, oldRate, newRate);
    }
    
    function processClaimApproval(uint256 claimId, uint256 amount) external onlyOwner claimExists(claimId) {
        Claim storage claim = _claims[claimId];
        require(claim.status == ClaimStatus.Pending, "Insurance: claim not pending");
        require(amount <= claim.amount, "Insurance: approved amount too high");
        
        claim.status = ClaimStatus.Approved;
        claim.amount = amount;
        
        // Get cover
        Cover storage cover = _covers[claim.coverId];
        
        // Update product stats
        _products[cover.productId].activeCoverCount--;
        _products[cover.productId].totalCoverAmount -= cover.coverAmount;
        
        // Transfer claim amount (in real contract)
        // token.transfer(claim.claimant, amount);
        
        emit ClaimApproved(claimId, amount, block.timestamp);
    }
    
    function processClaimRejection(uint256 claimId, string calldata reason) external onlyOwner claimExists(claimId) {
        Claim storage claim = _claims[claimId];
        require(claim.status == ClaimStatus.Pending, "Insurance: claim not pending");
        
        claim.status = ClaimStatus.Rejected;
        claim.rejectionReason = reason;
        
        emit ClaimRejected(claimId, reason, block.timestamp);
    }
    
    function deactivateProduct(uint256 productId) external onlyOwner productExists(productId) {
        _products[productId].active = false;
    }
    
    function activateProduct(uint256 productId) external onlyOwner {
        require(productId <= _productCounter, "Insurance: product does not exist");
        _products[productId].active = true;
    }
    
    function pause() external onlyOwner {
        _paused = true;
    }
    
    function unpause() external onlyOwner {
        _paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Insurance: new owner is the zero address");
        _owner = newOwner;
    }
    
    // ============ Internal Functions ============
    function _calculatePremium(
        uint256 productId,
        uint256 coverAmount,
        uint64 startTime,
        uint64 endTime
    ) internal view returns (uint256) {
        Product memory product = _products[productId];
        
        // Calculate premium based on cover amount, period and premium rate
        uint256 coverPeriod = endTime - startTime;
        uint256 annualPremium = (coverAmount * product.premiumRate) / BASIS_POINTS;
        uint256 premium = (annualPremium * coverPeriod) / SECONDS_PER_YEAR;
        
        return premium;
    }
    
    function _calculatePendingRewards(address staker) internal view returns (uint256) {
        Staker memory stakerInfo = _stakers[staker];
        
        if (stakerInfo.amount == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - stakerInfo.lastUpdateTime;
        uint256 annualReward = (stakerInfo.amount * REWARD_RATE) / BASIS_POINTS;
        uint256 pendingReward = (annualReward * timeElapsed) / SECONDS_PER_YEAR;
        
        return pendingReward;
    }
    
    // ============ Utility Functions ============
    function calculateRiskScore(
        address user,
        uint256 productId,
        uint256 coverAmount
    ) public view productExists(productId) returns (uint256) {
        // This is a simplified example of risk scoring
        // In a real contract, this would be much more complex
        
        // Get user's claim history
        uint256[] memory userClaimIds = _userClaims[user];
        uint256 claimCount = 0;
        uint256 approvedClaimCount = 0;
        
        for (uint256 i = 0; i < userClaimIds.length; i++) {
            Claim memory claim = _claims[userClaimIds[i]];
            Cover memory cover = _covers[claim.coverId];
            
            if (cover.productId == productId) {
                claimCount++;
                if (claim.status == ClaimStatus.Approved) {
                    approvedClaimCount++;
                }
            }
        }
        
        // Base risk score - starts at 50 (medium risk)
        uint256 riskScore = 50;
        
        // Adjust based on claim history
        if (claimCount > 0) {
            if (approvedClaimCount > 0) {
                // Increase risk for users with approved claims
                riskScore += (approvedClaimCount * 10);
            } else {
                // Slightly decrease risk for users with rejected claims only
                riskScore -= 5;
            }
        } else {
            // Decrease risk for users with no claims
            riskScore -= 10;
        }
        
        // Adjust based on cover amount relative to product max
        Product memory product = _products[productId];
        if (coverAmount > product.maxCoverAmount / 2) {
            riskScore += 5;
        }
        
        // Cap the risk score
        if (riskScore > 100) {
            riskScore = 100;
        } else if (riskScore < 10) {
            riskScore = 10;
        }
        
        return riskScore;
    }
    
    function calculatePremiumWithRisk(
        uint256 productId,
        uint256 coverAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 riskScore
    ) public view productExists(productId) returns (uint256) {
        // Calculate base premium
        uint256 basePremium = _calculatePremium(productId, coverAmount, startTime, endTime);
        
        // Apply risk multiplier
        uint256 riskMultiplier = ((riskScore - 50) * 2) + 100; // 0-100 score maps to 0-200% adjustment
        uint256 adjustedPremium = (basePremium * riskMultiplier) / 100;
        
        return adjustedPremium;
    }
}