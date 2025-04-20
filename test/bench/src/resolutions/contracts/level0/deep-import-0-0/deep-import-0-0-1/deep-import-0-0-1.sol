// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title deep-import-0-0-1
 * @dev Lending pool contract for benchmarking import resolution
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract DeepImport001 {
    // ============ Events ============
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, address indexed token, uint256 amount, uint256 timestamp);
    event Borrow(address indexed user, address indexed token, uint256 amount, uint256 timestamp);
    event Repay(address indexed user, address indexed token, uint256 amount, uint256 timestamp);
    event Liquidate(address indexed liquidator, address indexed borrower, address indexed token, uint256 amount, uint256 timestamp);
    event TokenAdded(address indexed token, uint256 loanToValue, uint256 liquidationThreshold);
    event TokenRemoved(address indexed token);
    event InterestRateUpdated(address indexed token, uint256 oldRate, uint256 newRate);
    
    // ============ Structs ============
    struct UserPosition {
        mapping(address => uint256) deposits;
        mapping(address => uint256) borrows;
        uint256 totalCollateralValue;
        uint256 totalBorrowValue;
        uint256 lastUpdateTime;
    }
    
    struct TokenConfig {
        bool active;
        uint256 loanToValue;        // Percentage, e.g., 75 for 75%
        uint256 liquidationThreshold; // Percentage, e.g., 80 for 80%
        uint256 interestRate;       // Annual percentage, e.g., 500 for 5%
        uint256 totalDeposited;
        uint256 totalBorrowed;
        uint256 lastUpdateTime;
    }
    
    // ============ Constants ============
    uint256 private constant SECONDS_PER_YEAR = 365 days;
    uint256 private constant LIQUIDATION_BONUS = 5; // 5% bonus for liquidators
    uint256 private constant MAX_PERCENTAGE = 100;
    uint256 private constant PRECISION = 1e18;
    
    // ============ Storage ============
    mapping(address => UserPosition) private _userPositions;
    mapping(address => TokenConfig) private _tokenConfigs;
    address[] private _supportedTokens;
    
    address private _owner;
    address private _oracle;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(msg.sender == _owner, "LendingPool: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "LendingPool: paused");
        _;
    }
    
    modifier validToken(address token) {
        require(_tokenConfigs[token].active, "LendingPool: token not supported");
        _;
    }
    
    // ============ Constructor ============
    constructor(address oracle_) {
        _owner = msg.sender;
        _oracle = oracle_;
    }
    
    // ============ External View Functions ============
    function getUserPosition(address user, address token) external view returns (
        uint256 depositAmount,
        uint256 borrowAmount,
        uint256 totalCollateralValue,
        uint256 totalBorrowValue,
        uint256 availableToBorrow,
        uint256 healthFactor
    ) {
        UserPosition storage position = _userPositions[user];
        depositAmount = position.deposits[token];
        borrowAmount = position.borrows[token];
        
        // Update total values with current prices and interest
        (totalCollateralValue, totalBorrowValue) = _calculateUserPositionValues(user);
        
        // Calculate available to borrow
        uint256 maxBorrowValue = totalCollateralValue * _getMaxLTV() / MAX_PERCENTAGE;
        availableToBorrow = totalBorrowValue >= maxBorrowValue ? 0 : maxBorrowValue - totalBorrowValue;
        
        // Calculate health factor
        healthFactor = totalBorrowValue == 0 ? type(uint256).max : (totalCollateralValue * PRECISION) / totalBorrowValue;
    }
    
    function getTokenConfig(address token) external view returns (
        bool active,
        uint256 loanToValue,
        uint256 liquidationThreshold,
        uint256 interestRate,
        uint256 totalDeposited,
        uint256 totalBorrowed
    ) {
        TokenConfig memory config = _tokenConfigs[token];
        return (
            config.active,
            config.loanToValue,
            config.liquidationThreshold,
            config.interestRate,
            config.totalDeposited,
            config.totalBorrowed
        );
    }
    
    function getSupportedTokens() external view returns (address[] memory) {
        return _supportedTokens;
    }
    
    function getTokenPrice(address token) external view returns (uint256) {
        // In a real contract, this would call the oracle
        // For this example, we'll return a mock price
        return _getTokenPrice(token);
    }
    
    // ============ External Mutative Functions ============
    function deposit(address token, uint256 amount) external whenNotPaused validToken(token) {
        require(amount > 0, "LendingPool: deposit amount must be positive");
        
        // Update position with accrued interest
        _updateUserPosition(msg.sender);
        _updateTokenConfig(token);
        
        // Transfer tokens from user (in real contract)
        // token.transferFrom(msg.sender, address(this), amount);
        
        // Update user position
        UserPosition storage position = _userPositions[msg.sender];
        position.deposits[token] += amount;
        
        // Update token config
        TokenConfig storage config = _tokenConfigs[token];
        config.totalDeposited += amount;
        
        // Recalculate user position values
        (position.totalCollateralValue, position.totalBorrowValue) = _calculateUserPositionValues(msg.sender);
        
        emit Deposit(msg.sender, token, amount, block.timestamp);
    }
    
    function withdraw(address token, uint256 amount) external whenNotPaused validToken(token) {
        require(amount > 0, "LendingPool: withdraw amount must be positive");
        
        // Update position with accrued interest
        _updateUserPosition(msg.sender);
        _updateTokenConfig(token);
        
        UserPosition storage position = _userPositions[msg.sender];
        require(position.deposits[token] >= amount, "LendingPool: insufficient deposit");
        
        // Update user position
        position.deposits[token] -= amount;
        
        // Update token config
        TokenConfig storage config = _tokenConfigs[token];
        config.totalDeposited -= amount;
        
        // Check if position remains healthy
        (uint256 newCollateralValue, uint256 newBorrowValue) = _calculateUserPositionValues(msg.sender);
        
        if (newBorrowValue > 0) {
            uint256 newMaxBorrow = (newCollateralValue * _getMaxLTV()) / MAX_PERCENTAGE;
            require(newBorrowValue <= newMaxBorrow, "LendingPool: insufficient collateral after withdrawal");
        }
        
        // Update position values
        position.totalCollateralValue = newCollateralValue;
        position.totalBorrowValue = newBorrowValue;
        
        // Transfer tokens to user (in real contract)
        // token.transfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, token, amount, block.timestamp);
    }
    
    function borrow(address token, uint256 amount) external whenNotPaused validToken(token) {
        require(amount > 0, "LendingPool: borrow amount must be positive");
        
        // Update position with accrued interest
        _updateUserPosition(msg.sender);
        _updateTokenConfig(token);
        
        // Check if there's enough liquidity
        TokenConfig storage config = _tokenConfigs[token];
        require(config.totalDeposited - config.totalBorrowed >= amount, "LendingPool: insufficient liquidity");
        
        // Get current token price
        uint256 tokenPrice = _getTokenPrice(token);
        
        // Calculate new borrow value
        UserPosition storage position = _userPositions[msg.sender];
        uint256 newBorrowValue = position.totalBorrowValue + (amount * tokenPrice / PRECISION);
        
        // Check if user has enough collateral
        uint256 maxBorrowValue = (position.totalCollateralValue * _getMaxLTV()) / MAX_PERCENTAGE;
        require(newBorrowValue <= maxBorrowValue, "LendingPool: insufficient collateral");
        
        // Update user position
        position.borrows[token] += amount;
        position.totalBorrowValue = newBorrowValue;
        
        // Update token config
        config.totalBorrowed += amount;
        
        // Transfer tokens to user (in real contract)
        // token.transfer(msg.sender, amount);
        
        emit Borrow(msg.sender, token, amount, block.timestamp);
    }
    
    function repay(address token, uint256 amount) external whenNotPaused validToken(token) {
        require(amount > 0, "LendingPool: repay amount must be positive");
        
        // Update position with accrued interest
        _updateUserPosition(msg.sender);
        _updateTokenConfig(token);
        
        UserPosition storage position = _userPositions[msg.sender];
        require(position.borrows[token] >= amount, "LendingPool: repay amount exceeds debt");
        
        // Transfer tokens from user (in real contract)
        // token.transferFrom(msg.sender, address(this), amount);
        
        // Update user position
        position.borrows[token] -= amount;
        
        // Recalculate position values
        (position.totalCollateralValue, position.totalBorrowValue) = _calculateUserPositionValues(msg.sender);
        
        // Update token config
        TokenConfig storage config = _tokenConfigs[token];
        config.totalBorrowed -= amount;
        
        emit Repay(msg.sender, token, amount, block.timestamp);
    }
    
    function liquidate(address borrower, address token, uint256 amount) external whenNotPaused validToken(token) {
        require(amount > 0, "LendingPool: liquidate amount must be positive");
        
        // Update positions with accrued interest
        _updateUserPosition(borrower);
        _updateUserPosition(msg.sender);
        _updateTokenConfig(token);
        
        // Check if position is liquidatable
        UserPosition storage borrowerPosition = _userPositions[borrower];
        (uint256 totalCollateralValue, uint256 totalBorrowValue) = _calculateUserPositionValues(borrower);
        
        uint256 healthFactor = (totalCollateralValue * PRECISION) / totalBorrowValue;
        uint256 liquidationThreshold = _getLiquidationThreshold();
        require(healthFactor < liquidationThreshold, "LendingPool: position not liquidatable");
        
        // Check if liquidation amount is valid
        require(borrowerPosition.borrows[token] >= amount, "LendingPool: liquidate amount exceeds debt");
        
        // Calculate collateral to seize
        uint256 tokenPrice = _getTokenPrice(token);
        uint256 valueToLiquidate = amount * tokenPrice / PRECISION;
        
        // Apply liquidation bonus
        uint256 valueToSeize = valueToLiquidate * (MAX_PERCENTAGE + LIQUIDATION_BONUS) / MAX_PERCENTAGE;
        
        // Find collateral to seize
        address collateralToken = _findBestCollateral(borrower, valueToSeize);
        require(collateralToken != address(0), "LendingPool: no suitable collateral found");
        
        uint256 collateralPrice = _getTokenPrice(collateralToken);
        uint256 collateralToSeize = (valueToSeize * PRECISION) / collateralPrice;
        
        require(borrowerPosition.deposits[collateralToken] >= collateralToSeize, "LendingPool: insufficient collateral");
        
        // Transfer debt tokens from liquidator (in real contract)
        // token.transferFrom(msg.sender, address(this), amount);
        
        // Update borrower position
        borrowerPosition.borrows[token] -= amount;
        borrowerPosition.deposits[collateralToken] -= collateralToSeize;
        
        // Update liquidator position
        UserPosition storage liquidatorPosition = _userPositions[msg.sender];
        liquidatorPosition.deposits[collateralToken] += collateralToSeize;
        
        // Update token config
        TokenConfig storage config = _tokenConfigs[token];
        config.totalBorrowed -= amount;
        
        // Recalculate position values
        (borrowerPosition.totalCollateralValue, borrowerPosition.totalBorrowValue) = _calculateUserPositionValues(borrower);
        (liquidatorPosition.totalCollateralValue, liquidatorPosition.totalBorrowValue) = _calculateUserPositionValues(msg.sender);
        
        emit Liquidate(msg.sender, borrower, token, amount, block.timestamp);
    }
    
    // ============ Admin Functions ============
    function addToken(
        address token,
        uint256 loanToValue,
        uint256 liquidationThreshold,
        uint256 interestRate
    ) external onlyOwner {
        require(!_tokenConfigs[token].active, "LendingPool: token already added");
        require(loanToValue <= liquidationThreshold, "LendingPool: invalid LTV and threshold");
        require(liquidationThreshold <= MAX_PERCENTAGE, "LendingPool: threshold exceeds 100%");
        
        _tokenConfigs[token] = TokenConfig({
            active: true,
            loanToValue: loanToValue,
            liquidationThreshold: liquidationThreshold,
            interestRate: interestRate,
            totalDeposited: 0,
            totalBorrowed: 0,
            lastUpdateTime: block.timestamp
        });
        
        _supportedTokens.push(token);
        
        emit TokenAdded(token, loanToValue, liquidationThreshold);
    }
    
    function removeToken(address token) external onlyOwner {
        require(_tokenConfigs[token].active, "LendingPool: token not active");
        require(_tokenConfigs[token].totalBorrowed == 0, "LendingPool: token has active borrows");
        
        _tokenConfigs[token].active = false;
        
        // Remove from supported tokens array
        for (uint256 i = 0; i < _supportedTokens.length; i++) {
            if (_supportedTokens[i] == token) {
                _supportedTokens[i] = _supportedTokens[_supportedTokens.length - 1];
                _supportedTokens.pop();
                break;
            }
        }
        
        emit TokenRemoved(token);
    }
    
    function updateInterestRate(address token, uint256 newRate) external onlyOwner validToken(token) {
        uint256 oldRate = _tokenConfigs[token].interestRate;
        _tokenConfigs[token].interestRate = newRate;
        
        emit InterestRateUpdated(token, oldRate, newRate);
    }
    
    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "LendingPool: invalid oracle address");
        _oracle = newOracle;
    }
    
    function pause() external onlyOwner {
        _paused = true;
    }
    
    function unpause() external onlyOwner {
        _paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "LendingPool: new owner is the zero address");
        _owner = newOwner;
    }
    
    // ============ Internal Functions ============
    function _updateUserPosition(address user) internal {
        UserPosition storage position = _userPositions[user];
        uint256 lastUpdateTime = position.lastUpdateTime;
        
        if (lastUpdateTime == 0) {
            position.lastUpdateTime = block.timestamp;
            return;
        }
        
        // Update each borrowed token with accrued interest
        for (uint256 i = 0; i < _supportedTokens.length; i++) {
            address token = _supportedTokens[i];
            if (!_tokenConfigs[token].active) continue;
            
            uint256 borrowAmount = position.borrows[token];
            if (borrowAmount == 0) continue;
            
            uint256 interestRate = _tokenConfigs[token].interestRate;
            uint256 timeElapsed = block.timestamp - lastUpdateTime;
            
            // Calculate accrued interest
            uint256 interest = (borrowAmount * interestRate * timeElapsed) / (SECONDS_PER_YEAR * MAX_PERCENTAGE);
            
            // Add interest to borrow amount
            position.borrows[token] = borrowAmount + interest;
            
            // Also update total borrowed for this token
            _tokenConfigs[token].totalBorrowed += interest;
        }
        
        // Update last update time
        position.lastUpdateTime = block.timestamp;
    }
    
    function _updateTokenConfig(address token) internal {
        TokenConfig storage config = _tokenConfigs[token];
        config.lastUpdateTime = block.timestamp;
    }
    
    function _calculateUserPositionValues(address user) internal view returns (uint256 collateralValue, uint256 borrowValue) {
        UserPosition storage position = _userPositions[user];
        
        for (uint256 i = 0; i < _supportedTokens.length; i++) {
            address token = _supportedTokens[i];
            if (!_tokenConfigs[token].active) continue;
            
            uint256 tokenPrice = _getTokenPrice(token);
            
            // Add deposit value to collateral
            uint256 depositAmount = position.deposits[token];
            if (depositAmount > 0) {
                collateralValue += (depositAmount * tokenPrice) / PRECISION;
            }
            
            // Add borrow value
            uint256 borrowAmount = position.borrows[token];
            if (borrowAmount > 0) {
                borrowValue += (borrowAmount * tokenPrice) / PRECISION;
            }
        }
        
        return (collateralValue, borrowValue);
    }
    
    function _getTokenPrice(address token) internal view returns (uint256) {
        // In a real contract, this would call the oracle
        // For this example, we return mock prices
        if (token == address(1)) return 1 * PRECISION; // 1 USD
        if (token == address(2)) return 2000 * PRECISION; // 2000 USD
        if (token == address(3)) return 3000 * PRECISION; // 3000 USD
        return PRECISION; // Default 1 USD
    }
    
    function _getMaxLTV() internal view returns (uint256) {
        // For simplicity, we're using a fixed max LTV
        // In a real contract, this could be more complex
        return 75; // 75%
    }
    
    function _getLiquidationThreshold() internal view returns (uint256) {
        // For simplicity, we return a fixed threshold
        // In a real contract, this could be more complex
        return 80; // 80%
    }
    
    function _findBestCollateral(address user, uint256 valueNeeded) internal view returns (address) {
        UserPosition storage position = _userPositions[user];
        
        address bestToken = address(0);
        uint256 bestValue = 0;
        
        for (uint256 i = 0; i < _supportedTokens.length; i++) {
            address token = _supportedTokens[i];
            if (!_tokenConfigs[token].active) continue;
            
            uint256 depositAmount = position.deposits[token];
            if (depositAmount == 0) continue;
            
            uint256 tokenPrice = _getTokenPrice(token);
            uint256 depositValue = (depositAmount * tokenPrice) / PRECISION;
            
            if (depositValue >= valueNeeded && (bestToken == address(0) || depositValue < bestValue)) {
                bestToken = token;
                bestValue = depositValue;
            }
        }
        
        return bestToken;
    }
}