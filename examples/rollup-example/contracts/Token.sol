// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**uint256(decimals);
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Insufficient allowance");
        
        balances[from] -= amount;
        balances[to] += amount;
        allowances[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    function mint(address to, uint256 amount) public {
        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function burn(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}