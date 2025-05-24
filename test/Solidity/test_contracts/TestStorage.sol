// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TestStorage
 * @dev Test contract for storage operations
 */
contract TestStorage {
    // Storage variables
    uint256 public value;
    mapping(address => uint256) public balances;
    uint256[] public numbers;
    
    // Test basic storage read/write
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
    
    // Test mapping operations
    function setBalance(address addr, uint256 amount) public {
        balances[addr] = amount;
    }
    
    function getBalance(address addr) public view returns (uint256) {
        return balances[addr];
    }
    
    // Test array operations
    function pushNumber(uint256 num) public {
        numbers.push(num);
    }
    
    function getNumber(uint256 index) public view returns (uint256) {
        return numbers[index];
    }
    
    function getNumbersLength() public view returns (uint256) {
        return numbers.length;
    }
    
    // Test complex storage patterns
    function incrementValue() public returns (uint256) {
        value += 1;
        return value;
    }
    
    function swapValues(uint256 a, uint256 b) public pure returns (uint256, uint256) {
        return (b, a);
    }
}