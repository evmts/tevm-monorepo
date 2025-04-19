// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IERC20.sol";
import "../libraries/SafeMath.sol";
import "./TokenStorage.sol";
import "./TokenEvents.sol";

contract Token is IERC20, TokenEvents {
    using SafeMath for uint256;

    TokenStorage private _storage;
    string public constant name = "Example Token";
    string public constant symbol = "EXTKN";
    uint8 public constant decimals = 18;

    constructor() {
        _storage.totalSupply = 1000000 * 10**decimals;
        _storage.balances[msg.sender] = _storage.totalSupply;
        emit Transfer(address(0), msg.sender, _storage.totalSupply);
    }
    
    function totalSupply() external view override returns (uint256) {
        return _storage.totalSupply;
    }
    
    function balanceOf(address account) external view override returns (uint256) {
        return _storage.balances[account];
    }
    
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function allowance(address owner, address spender) external view override returns (uint256) {
        return _storage.allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        _transfer(sender, recipient, amount);
        
        uint256 currentAllowance = _storage.allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }
        
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        
        uint256 senderBalance = _storage.balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _storage.balances[sender] = senderBalance - amount;
        }
        _storage.balances[recipient] += amount;
        
        emit Transfer(sender, recipient, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _storage.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function mint(address account, uint256 amount) external {
        require(account != address(0), "ERC20: mint to the zero address");
        
        _storage.totalSupply += amount;
        _storage.balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}