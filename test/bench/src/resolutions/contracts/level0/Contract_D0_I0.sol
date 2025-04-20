// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@lib1/level1/Lib1_D1_I0.sol";
import "@lib4/level1/Lib4_D1_I1.sol";
import "../level1/Contract_D1_I2.sol";
import "../level1/Contract_D1_I3.sol";
import "./deep-import-0-0/deep-import-0-0.sol";
import "./deep-import-0-1/deep-import-0-1.sol";

/**
 * @title Contract_D0_I0
 * @dev This is a complex contract with typical patterns found in production code
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract Contract_D0_I0 {
    // ============ Events ============
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event NewOwner(address indexed previousOwner, address indexed newOwner);
    
    // ============ Storage ============
    uint256 private constant MAX_UINT256 = type(uint256).max;
    bytes32 private constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _tokenCount;
    
    address private _owner;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }
    
    // ============ Constructor ============
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        _owner = msg.sender;
        
        // Generate some random initial state
        _totalSupply = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, address(this)))) % 1000000 * 10**18;
        _balances[msg.sender] = _totalSupply;
        
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit NewOwner(address(0), msg.sender);
    }
    
    // ============ Public Functions ============
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public whenNotPaused returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, _allowances[owner][spender] + addedValue);
        return true;
    }
    
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }
        return true;
    }
    
    // ============ Owner Functions ============
    function pause() public onlyOwner {
        _paused = true;
    }
    
    function unpause() public onlyOwner {
        _paused = false;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "ERC20: mint to the zero address");
        
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function burn(uint256 amount) public {
        address account = msg.sender;
        require(account != address(0), "ERC20: burn from the zero address");
        
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;
        
        emit Transfer(account, address(0), amount);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        address oldOwner = _owner;
        _owner = newOwner;
        emit NewOwner(oldOwner, newOwner);
    }
    
    // ============ Internal Functions ============
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = _allowances[owner][spender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
    
    // Some complex computation to simulate real contract code
    function complexComputation(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        
        uint256 result = 0;
        for (uint256 i = 0; i < 10; i++) {
            result += c / (i + 1);
        }
        
        return result;
    }
}
