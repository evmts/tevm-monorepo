// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TestBasicOps
 * @dev Test contract for basic EVM operations
 */
contract TestBasicOps {
    // Test 1: Basic arithmetic
    function testAdd() public pure returns (uint256) {
        return 10 + 20;  // Should return 30
    }
    
    function testSub() public pure returns (uint256) {
        return 50 - 20;  // Should return 30
    }
    
    function testMul() public pure returns (uint256) {
        return 6 * 5;    // Should return 30
    }
    
    function testDiv() public pure returns (uint256) {
        return 60 / 2;   // Should return 30
    }
    
    // Test 2: Comparison operations
    function testLt() public pure returns (bool) {
        return 10 < 20;  // Should return true
    }
    
    function testGt() public pure returns (bool) {
        return 30 > 20;  // Should return true
    }
    
    function testEq() public pure returns (bool) {
        return 15 == 15; // Should return true
    }
    
    // Test 3: Bitwise operations
    function testAnd() public pure returns (uint256) {
        return 15 & 7;   // Should return 7 (0xF & 0x7 = 0x7)
    }
    
    function testOr() public pure returns (uint256) {
        return 8 | 4;    // Should return 12 (0x8 | 0x4 = 0xC)
    }
    
    function testXor() public pure returns (uint256) {
        return 15 ^ 10;  // Should return 5 (0xF ^ 0xA = 0x5)
    }
    
    function testNot() public pure returns (uint256) {
        return ~uint256(0); // Should return max uint256
    }
    
    // Test 4: Shift operations
    function testShl() public pure returns (uint256) {
        return 1 << 4;   // Should return 16
    }
    
    function testShr() public pure returns (uint256) {
        return 32 >> 2;  // Should return 8
    }
    
    // Test 5: Simple return values
    function returnTrue() public pure returns (bool) {
        return true;
    }
    
    function returnFalse() public pure returns (bool) {
        return false;
    }
    
    function returnByte() public pure returns (bytes1) {
        return bytes1(0x42);
    }
    
    function returnThreeBytes() public pure returns (bytes1, bytes1, bytes1) {
        return (bytes1(0x01), bytes1(0x02), bytes1(0x03));
    }
}