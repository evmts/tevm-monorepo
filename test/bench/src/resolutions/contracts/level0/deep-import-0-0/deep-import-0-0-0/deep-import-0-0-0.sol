// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title deep-import-0-0-0
 * @dev Oracle contract implementation for benchmarking import resolution
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract DeepImport000 {
    // ============ Events ============
    event PriceUpdated(address indexed token, uint256 oldPrice, uint256 newPrice);
    event OracleAdded(address indexed oracle, uint256 timestamp);
    event OracleRemoved(address indexed oracle, uint256 timestamp);
    event TokenAdded(address indexed token, string symbol, uint256 timestamp);
    event TokenRemoved(address indexed token, string symbol, uint256 timestamp);
    
    // ============ Structs ============
    struct TokenInfo {
        string symbol;
        uint256 price;
        uint256 lastUpdated;
        bool active;
    }
    
    struct OracleInfo {
        uint256 updateCount;
        uint256 lastUpdate;
        bool active;
    }
    
    // ============ Storage ============
    mapping(address => TokenInfo) private _tokenInfo;
    mapping(address => OracleInfo) private _oracles;
    mapping(address => mapping(address => uint256)) private _oracleReports;
    
    address[] private _activeTokens;
    address[] private _activeOracles;
    address private _owner;
    uint256 private _minimumOracleCount;
    uint256 private _updateInterval;
    uint256 private _maxPriceDeviation;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(msg.sender == _owner, "Oracle: caller is not the owner");
        _;
    }
    
    modifier onlyOracle() {
        require(_oracles[msg.sender].active, "Oracle: caller is not an active oracle");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "Oracle: paused");
        _;
    }
    
    // ============ Constructor ============
    constructor() {
        _owner = msg.sender;
        _minimumOracleCount = 3;
        _updateInterval = 1 hours;
        _maxPriceDeviation = 5; // 5% max deviation
    }
    
    // ============ External View Functions ============
    function getTokenPrice(address token) external view returns (uint256 price, uint256 lastUpdated) {
        require(_tokenInfo[token].active, "Oracle: token not active");
        return (_tokenInfo[token].price, _tokenInfo[token].lastUpdated);
    }
    
    function getTokenInfo(address token) external view returns (
        string memory symbol,
        uint256 price,
        uint256 lastUpdated,
        bool active
    ) {
        TokenInfo memory info = _tokenInfo[token];
        return (info.symbol, info.price, info.lastUpdated, info.active);
    }
    
    function getOracleInfo(address oracle) external view returns (
        uint256 updateCount,
        uint256 lastUpdate,
        bool active
    ) {
        OracleInfo memory info = _oracles[oracle];
        return (info.updateCount, info.lastUpdate, info.active);
    }
    
    function getActiveTokens() external view returns (address[] memory) {
        return _activeTokens;
    }
    
    function getActiveOracles() external view returns (address[] memory) {
        return _activeOracles;
    }
    
    function isOracleActive(address oracle) external view returns (bool) {
        return _oracles[oracle].active;
    }
    
    function isTokenActive(address token) external view returns (bool) {
        return _tokenInfo[token].active;
    }
    
    function minimumOracleCount() external view returns (uint256) {
        return _minimumOracleCount;
    }
    
    function updateInterval() external view returns (uint256) {
        return _updateInterval;
    }
    
    function maxPriceDeviation() external view returns (uint256) {
        return _maxPriceDeviation;
    }
    
    // ============ External Mutative Functions ============
    function updatePrice(address token, uint256 price) external onlyOracle whenNotPaused {
        require(_tokenInfo[token].active, "Oracle: token not active");
        require(price > 0, "Oracle: price must be positive");
        
        // Record oracle's price report
        _oracleReports[token][msg.sender] = price;
        
        // Update oracle info
        _oracles[msg.sender].updateCount++;
        _oracles[msg.sender].lastUpdate = block.timestamp;
        
        // Check if we have enough reports to update the price
        address[] memory reportingOracles = new address[](_activeOracles.length);
        uint256 reportCount = 0;
        
        for (uint256 i = 0; i < _activeOracles.length; i++) {
            address oracle = _activeOracles[i];
            if (_oracleReports[token][oracle] > 0) {
                reportingOracles[reportCount] = oracle;
                reportCount++;
            }
        }
        
        if (reportCount >= _minimumOracleCount) {
            // Calculate median price
            uint256[] memory prices = new uint256[](reportCount);
            for (uint256 i = 0; i < reportCount; i++) {
                prices[i] = _oracleReports[token][reportingOracles[i]];
            }
            
            // Sort prices
            for (uint256 i = 0; i < reportCount; i++) {
                for (uint256 j = i + 1; j < reportCount; j++) {
                    if (prices[i] > prices[j]) {
                        uint256 temp = prices[i];
                        prices[i] = prices[j];
                        prices[j] = temp;
                    }
                }
            }
            
            // Get median price
            uint256 medianPrice;
            if (reportCount % 2 == 0) {
                medianPrice = (prices[reportCount / 2 - 1] + prices[reportCount / 2]) / 2;
            } else {
                medianPrice = prices[reportCount / 2];
            }
            
            // Check if the price deviation is acceptable
            uint256 oldPrice = _tokenInfo[token].price;
            if (oldPrice > 0) {
                uint256 deviation;
                if (medianPrice > oldPrice) {
                    deviation = ((medianPrice - oldPrice) * 100) / oldPrice;
                } else {
                    deviation = ((oldPrice - medianPrice) * 100) / oldPrice;
                }
                
                require(deviation <= _maxPriceDeviation, "Oracle: price deviation too high");
            }
            
            // Update price
            _tokenInfo[token].price = medianPrice;
            _tokenInfo[token].lastUpdated = block.timestamp;
            
            emit PriceUpdated(token, oldPrice, medianPrice);
            
            // Reset oracle reports for this token
            for (uint256 i = 0; i < reportCount; i++) {
                delete _oracleReports[token][reportingOracles[i]];
            }
        }
    }
    
    // ============ Admin Functions ============
    function addOracle(address oracle) external onlyOwner {
        require(!_oracles[oracle].active, "Oracle: oracle already active");
        
        _oracles[oracle] = OracleInfo({
            updateCount: 0,
            lastUpdate: 0,
            active: true
        });
        
        _activeOracles.push(oracle);
        
        emit OracleAdded(oracle, block.timestamp);
    }
    
    function removeOracle(address oracle) external onlyOwner {
        require(_oracles[oracle].active, "Oracle: oracle not active");
        
        _oracles[oracle].active = false;
        
        // Remove from active oracles array
        for (uint256 i = 0; i < _activeOracles.length; i++) {
            if (_activeOracles[i] == oracle) {
                _activeOracles[i] = _activeOracles[_activeOracles.length - 1];
                _activeOracles.pop();
                break;
            }
        }
        
        emit OracleRemoved(oracle, block.timestamp);
    }
    
    function addToken(address token, string calldata symbol) external onlyOwner {
        require(!_tokenInfo[token].active, "Oracle: token already active");
        
        _tokenInfo[token] = TokenInfo({
            symbol: symbol,
            price: 0,
            lastUpdated: 0,
            active: true
        });
        
        _activeTokens.push(token);
        
        emit TokenAdded(token, symbol, block.timestamp);
    }
    
    function removeToken(address token) external onlyOwner {
        require(_tokenInfo[token].active, "Oracle: token not active");
        
        string memory symbol = _tokenInfo[token].symbol;
        _tokenInfo[token].active = false;
        
        // Remove from active tokens array
        for (uint256 i = 0; i < _activeTokens.length; i++) {
            if (_activeTokens[i] == token) {
                _activeTokens[i] = _activeTokens[_activeTokens.length - 1];
                _activeTokens.pop();
                break;
            }
        }
        
        // Clear oracle reports for this token
        for (uint256 i = 0; i < _activeOracles.length; i++) {
            delete _oracleReports[token][_activeOracles[i]];
        }
        
        emit TokenRemoved(token, symbol, block.timestamp);
    }
    
    function setMinimumOracleCount(uint256 count) external onlyOwner {
        require(count > 0, "Oracle: count must be positive");
        _minimumOracleCount = count;
    }
    
    function setUpdateInterval(uint256 interval) external onlyOwner {
        _updateInterval = interval;
    }
    
    function setMaxPriceDeviation(uint256 deviation) external onlyOwner {
        require(deviation > 0, "Oracle: deviation must be positive");
        _maxPriceDeviation = deviation;
    }
    
    function pause() external onlyOwner {
        _paused = true;
    }
    
    function unpause() external onlyOwner {
        _paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Oracle: new owner is the zero address");
        _owner = newOwner;
    }
    
    // ============ Utility Functions ============
    function calculateVolumeWeightedAveragePrice(
        uint256[] memory prices,
        uint256[] memory volumes
    ) public pure returns (uint256) {
        require(prices.length == volumes.length, "Oracle: arrays length mismatch");
        require(prices.length > 0, "Oracle: empty arrays");
        
        uint256 totalVolume = 0;
        uint256 sumOfVolumeTimesPrice = 0;
        
        for (uint256 i = 0; i < prices.length; i++) {
            totalVolume += volumes[i];
            sumOfVolumeTimesPrice += prices[i] * volumes[i];
        }
        
        require(totalVolume > 0, "Oracle: total volume is zero");
        
        return sumOfVolumeTimesPrice / totalVolume;
    }
    
    function calculateExponentialMovingAverage(
        uint256 currentPrice,
        uint256 newPrice,
        uint256 alpha
    ) public pure returns (uint256) {
        require(alpha <= 100, "Oracle: alpha must be <= 100");
        
        if (currentPrice == 0) {
            return newPrice;
        }
        
        // EMA = currentPrice * (1 - alpha) + newPrice * alpha
        // Where alpha is between 0 and 1, represented here as 0-100 for integer math
        return (currentPrice * (100 - alpha) + newPrice * alpha) / 100;
    }
}