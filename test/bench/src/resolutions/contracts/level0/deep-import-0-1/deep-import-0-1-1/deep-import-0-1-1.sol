// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title deep-import-0-1-1
 * @dev DEX (Decentralized Exchange) contract for benchmarking import resolution
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract DeepImport011 {
    // ============ Events ============
    event TokenListed(address indexed token, string name, string symbol, uint8 decimals);
    event LiquidityAdded(address indexed provider, address indexed tokenA, address indexed tokenB, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, address indexed tokenA, address indexed tokenB, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);
    event ProtocolFeeCollected(address indexed token, uint256 amount);
    
    // ============ Structs ============
    struct TokenInfo {
        string name;
        string symbol;
        uint8 decimals;
        bool listed;
    }
    
    struct Pair {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        mapping(address => uint256) liquidity;
        uint256 lastK;
        uint256 blockTimestampLast;
        uint256 price0CumulativeLast;
        uint256 price1CumulativeLast;
    }
    
    // ============ Constants ============
    uint256 private constant MINIMUM_LIQUIDITY = 1000;
    uint256 private constant FEE_DENOMINATOR = 10000;
    
    // ============ Storage ============
    mapping(address => TokenInfo) private _tokenInfo;
    mapping(address => mapping(address => bytes32)) private _pairIds;
    mapping(bytes32 => Pair) private _pairs;
    
    address[] private _listedTokens;
    bytes32[] private _activePairs;
    
    address private _owner;
    uint256 private _fee; // In basis points (e.g., 30 = 0.3%)
    uint256 private _protocolFee; // In basis points (e.g., 5 = 0.05%)
    address private _feeCollector;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(msg.sender == _owner, "DEX: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "DEX: paused");
        _;
    }
    
    modifier tokenExists(address token) {
        require(_tokenInfo[token].listed, "DEX: token not listed");
        _;
    }
    
    modifier pairExists(address tokenA, address tokenB) {
        bytes32 pairId = _getPairId(tokenA, tokenB);
        require(pairId != bytes32(0), "DEX: pair does not exist");
        _;
    }
    
    // ============ Constructor ============
    constructor() {
        _owner = msg.sender;
        _fee = 30; // 0.3%
        _protocolFee = 5; // 0.05%
        _feeCollector = msg.sender;
    }
    
    // ============ External View Functions ============
    function getTokenInfo(address token) external view returns (
        string memory name,
        string memory symbol,
        uint8 decimals,
        bool listed
    ) {
        TokenInfo memory info = _tokenInfo[token];
        return (info.name, info.symbol, info.decimals, info.listed);
    }
    
    function getPair(address tokenA, address tokenB) external view returns (
        address addressA,
        address addressB,
        uint256 reserveA,
        uint256 reserveB,
        uint256 totalLiquidity
    ) {
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        bytes32 pairId = _pairIds[token0][token1];
        require(pairId != bytes32(0), "DEX: pair does not exist");
        
        Pair storage pair = _pairs[pairId];
        return (pair.tokenA, pair.tokenB, pair.reserveA, pair.reserveB, pair.totalLiquidity);
    }
    
    function getLiquidity(address tokenA, address tokenB, address provider) external view pairExists(tokenA, tokenB) returns (uint256) {
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        bytes32 pairId = _pairIds[token0][token1];
        return _pairs[pairId].liquidity[provider];
    }
    
    function getReserves(address tokenA, address tokenB) external view pairExists(tokenA, tokenB) returns (uint256 reserveA, uint256 reserveB) {
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        bytes32 pairId = _pairIds[token0][token1];
        Pair storage pair = _pairs[pairId];
        
        if (tokenA == token0) {
            return (pair.reserveA, pair.reserveB);
        } else {
            return (pair.reserveB, pair.reserveA);
        }
    }
    
    function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) external view pairExists(tokenIn, tokenOut) returns (uint256) {
        return _getAmountOut(tokenIn, tokenOut, amountIn);
    }
    
    function getAmountIn(address tokenIn, address tokenOut, uint256 amountOut) external view pairExists(tokenIn, tokenOut) returns (uint256) {
        return _getAmountIn(tokenIn, tokenOut, amountOut);
    }
    
    function getListedTokens() external view returns (address[] memory) {
        return _listedTokens;
    }
    
    function getActivePairsCount() external view returns (uint256) {
        return _activePairs.length;
    }
    
    function getPairByIndex(uint256 index) external view returns (address tokenA, address tokenB) {
        require(index < _activePairs.length, "DEX: index out of bounds");
        bytes32 pairId = _activePairs[index];
        Pair storage pair = _pairs[pairId];
        return (pair.tokenA, pair.tokenB);
    }
    
    function getFee() external view returns (uint256) {
        return _fee;
    }
    
    function getProtocolFee() external view returns (uint256) {
        return _protocolFee;
    }
    
    // ============ External Mutative Functions ============
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) external whenNotPaused tokenExists(tokenA) tokenExists(tokenB) returns (uint256, uint256, uint256) {
        require(tokenA != tokenB, "DEX: identical tokens");
        
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        bytes32 pairId = _pairIds[token0][token1];
        
        if (pairId == bytes32(0)) {
            // Create new pair
            pairId = keccak256(abi.encodePacked(token0, token1));
            _pairIds[token0][token1] = pairId;
            
            Pair storage newPair = _pairs[pairId];
            newPair.tokenA = token0;
            newPair.tokenB = token1;
            
            _activePairs.push(pairId);
        }
        
        Pair storage pair = _pairs[pairId];
        
        uint256 amountA;
        uint256 amountB;
        
        if (pair.totalLiquidity == 0) {
            // First liquidity provision
            amountA = amountADesired;
            amountB = amountBDesired;
            
            // Lock minimum liquidity forever
            pair.totalLiquidity = MINIMUM_LIQUIDITY;
        } else {
            // Calculate optimal amounts
            uint256 amountBOptimal = (amountADesired * pair.reserveB) / pair.reserveA;
            
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "DEX: insufficient B amount");
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                uint256 amountAOptimal = (amountBDesired * pair.reserveA) / pair.reserveB;
                require(amountAOptimal <= amountADesired, "DEX: excessive A amount");
                require(amountAOptimal >= amountAMin, "DEX: insufficient A amount");
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
            
            // Calculate liquidity to mint
            uint256 liquidity;
            {
                uint256 liquidityA = (amountA * pair.totalLiquidity) / pair.reserveA;
                uint256 liquidityB = (amountB * pair.totalLiquidity) / pair.reserveB;
                liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
            }
            
            pair.totalLiquidity += liquidity;
            pair.liquidity[msg.sender] += liquidity;
        }
        
        // Transfer tokens
        // In a real contract, we would do transferFrom here
        // tokenA.transferFrom(msg.sender, address(this), amountA);
        // tokenB.transferFrom(msg.sender, address(this), amountB);
        
        // Update reserves
        pair.reserveA += amountA;
        pair.reserveB += amountB;
        pair.lastK = pair.reserveA * pair.reserveB;
        pair.blockTimestampLast = block.timestamp;
        
        // Calculate liquidity
        uint256 liquidity = pair.liquidity[msg.sender];
        
        emit LiquidityAdded(msg.sender, tokenA, tokenB, amountA, amountB, liquidity);
        
        return (amountA, amountB, liquidity);
    }
    
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin
    ) external whenNotPaused pairExists(tokenA, tokenB) returns (uint256, uint256) {
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        bytes32 pairId = _pairIds[token0][token1];
        Pair storage pair = _pairs[pairId];
        
        require(pair.liquidity[msg.sender] >= liquidity, "DEX: insufficient liquidity");
        
        // Calculate amounts to return
        uint256 amountA = (liquidity * pair.reserveA) / pair.totalLiquidity;
        uint256 amountB = (liquidity * pair.reserveB) / pair.totalLiquidity;
        
        require(amountA >= amountAMin, "DEX: insufficient A amount");
        require(amountB >= amountBMin, "DEX: insufficient B amount");
        
        // Update liquidity
        pair.liquidity[msg.sender] -= liquidity;
        pair.totalLiquidity -= liquidity;
        
        // Update reserves
        pair.reserveA -= amountA;
        pair.reserveB -= amountB;
        pair.lastK = pair.reserveA * pair.reserveB;
        pair.blockTimestampLast = block.timestamp;
        
        // Transfer tokens back to user
        // In a real contract, we would do transfer here
        // tokenA.transfer(msg.sender, amountA);
        // tokenB.transfer(msg.sender, amountB);
        
        emit LiquidityRemoved(msg.sender, tokenA, tokenB, amountA, amountB, liquidity);
        
        return (amountA, amountB);
    }
    
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address to
    ) external whenNotPaused pairExists(tokenIn, tokenOut) returns (uint256) {
        require(tokenIn != tokenOut, "DEX: identical tokens");
        require(amountIn > 0, "DEX: insufficient input amount");
        
        uint256 amountOut = _getAmountOut(tokenIn, tokenOut, amountIn);
        require(amountOut >= amountOutMin, "DEX: insufficient output amount");
        
        // Transfer tokens
        // In a real contract, we would do transferFrom/transfer here
        // tokenIn.transferFrom(msg.sender, address(this), amountIn);
        // tokenOut.transfer(to, amountOut);
        
        // Update reserves
        (address token0, address token1) = _sortTokens(tokenIn, tokenOut);
        bytes32 pairId = _pairIds[token0][token1];
        Pair storage pair = _pairs[pairId];
        
        // Calculate protocol fee
        uint256 protocolFeeAmount = 0;
        if (_protocolFee > 0) {
            protocolFeeAmount = (amountIn * _protocolFee) / FEE_DENOMINATOR;
            // In a real contract, we would accumulate protocol fees
        }
        
        if (tokenIn == token0) {
            pair.reserveA += amountIn - protocolFeeAmount;
            pair.reserveB -= amountOut;
        } else {
            pair.reserveA -= amountOut;
            pair.reserveB += amountIn - protocolFeeAmount;
        }
        
        // Verify k didn't decrease (prevent flash loan attacks)
        require(pair.reserveA * pair.reserveB >= pair.lastK, "DEX: K decreased");
        pair.lastK = pair.reserveA * pair.reserveB;
        
        // Update price accumulators
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - uint32(pair.blockTimestampLast);
        if (timeElapsed > 0 && pair.reserveA > 0 && pair.reserveB > 0) {
            // Price0: reserveB/reserveA
            // Price1: reserveA/reserveB
            pair.price0CumulativeLast += uint256(UQ112x112.encode(uint112(pair.reserveB) * 2**112 / uint112(pair.reserveA))) * timeElapsed;
            pair.price1CumulativeLast += uint256(UQ112x112.encode(uint112(pair.reserveA) * 2**112 / uint112(pair.reserveB))) * timeElapsed;
        }
        pair.blockTimestampLast = blockTimestamp;
        
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
        
        return amountOut;
    }
    
    // ============ Admin Functions ============
    function listToken(
        address token,
        string calldata name,
        string calldata symbol,
        uint8 decimals
    ) external onlyOwner {
        require(!_tokenInfo[token].listed, "DEX: token already listed");
        
        _tokenInfo[token] = TokenInfo({
            name: name,
            symbol: symbol,
            decimals: decimals,
            listed: true
        });
        
        _listedTokens.push(token);
        
        emit TokenListed(token, name, symbol, decimals);
    }
    
    function delistToken(address token) external onlyOwner {
        require(_tokenInfo[token].listed, "DEX: token not listed");
        
        // Remove from listed tokens
        for (uint256 i = 0; i < _listedTokens.length; i++) {
            if (_listedTokens[i] == token) {
                _listedTokens[i] = _listedTokens[_listedTokens.length - 1];
                _listedTokens.pop();
                break;
            }
        }
        
        // Delist token
        _tokenInfo[token].listed = false;
    }
    
    function setFee(uint256 newFee) external onlyOwner {
        require(newFee < FEE_DENOMINATOR, "DEX: fee too high");
        uint256 oldFee = _fee;
        _fee = newFee;
        
        emit FeeUpdated(oldFee, newFee);
    }
    
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee < _fee, "DEX: protocol fee exceeds swap fee");
        uint256 oldFee = _protocolFee;
        _protocolFee = newFee;
        
        emit ProtocolFeeUpdated(oldFee, newFee);
    }
    
    function setFeeCollector(address collector) external onlyOwner {
        require(collector != address(0), "DEX: zero address");
        _feeCollector = collector;
    }
    
    function collectProtocolFees(address token) external onlyOwner returns (uint256) {
        // In a real contract, this would collect accumulated protocol fees
        // uint256 amount = _protocolFees[token];
        // _protocolFees[token] = 0;
        // token.transfer(_feeCollector, amount);
        
        // For this example, we'll just emit an event
        emit ProtocolFeeCollected(token, 0);
        
        return 0;
    }
    
    function pause() external onlyOwner {
        _paused = true;
    }
    
    function unpause() external onlyOwner {
        _paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "DEX: new owner is the zero address");
        _owner = newOwner;
    }
    
    // ============ Internal Functions ============
    function _sortTokens(address tokenA, address tokenB) internal pure returns (address, address) {
        return tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }
    
    function _getPairId(address tokenA, address tokenB) internal view returns (bytes32) {
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        return _pairIds[token0][token1];
    }
    
    function _getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) internal view returns (uint256) {
        (address token0, address token1) = _sortTokens(tokenIn, tokenOut);
        bytes32 pairId = _pairIds[token0][token1];
        Pair storage pair = _pairs[pairId];
        
        uint256 reserveIn;
        uint256 reserveOut;
        
        if (tokenIn == token0) {
            reserveIn = pair.reserveA;
            reserveOut = pair.reserveB;
        } else {
            reserveIn = pair.reserveB;
            reserveOut = pair.reserveA;
        }
        
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - _fee) / FEE_DENOMINATOR;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn + amountInWithFee;
        
        return numerator / denominator;
    }
    
    function _getAmountIn(address tokenIn, address tokenOut, uint256 amountOut) internal view returns (uint256) {
        (address token0, address token1) = _sortTokens(tokenIn, tokenOut);
        bytes32 pairId = _pairIds[token0][token1];
        Pair storage pair = _pairs[pairId];
        
        uint256 reserveIn;
        uint256 reserveOut;
        
        if (tokenIn == token0) {
            reserveIn = pair.reserveA;
            reserveOut = pair.reserveB;
        } else {
            reserveIn = pair.reserveB;
            reserveOut = pair.reserveA;
        }
        
        require(amountOut < reserveOut, "DEX: insufficient output reserve");
        
        uint256 numerator = reserveIn * amountOut * FEE_DENOMINATOR;
        uint256 denominator = (reserveOut - amountOut) * (FEE_DENOMINATOR - _fee);
        
        return (numerator / denominator) + 1;
    }
}

// Helper for fixed point arithmetic
library UQ112x112 {
    uint224 constant Q112 = 2**112;

    function encode(uint112 y) internal pure returns (uint224) {
        return uint224(y) * Q112;
    }

    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224) {
        return x / uint224(y);
    }
}