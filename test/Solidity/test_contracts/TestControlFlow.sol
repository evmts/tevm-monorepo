// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TestControlFlow
 * @dev Test contract for control flow operations
 */
contract TestControlFlow {
    // Test if-else statements
    function testIfElse(uint256 x) public pure returns (string memory) {
        if (x > 10) {
            return "greater";
        } else if (x == 10) {
            return "equal";
        } else {
            return "less";
        }
    }
    
    // Test loops
    function testForLoop(uint256 n) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    }
    
    function testWhileLoop(uint256 n) public pure returns (uint256) {
        uint256 sum = 0;
        uint256 i = 1;
        while (i <= n) {
            sum += i;
            i++;
        }
        return sum;
    }
    
    // Test require/revert
    function testRequire(uint256 x) public pure returns (uint256) {
        require(x > 0, "Value must be positive");
        return x * 2;
    }
    
    function testRevert(bool shouldRevert) public pure returns (string memory) {
        if (shouldRevert) {
            revert("Intentional revert");
        }
        return "Success";
    }
    
    // Test function calls
    function internalHelper(uint256 x) internal pure returns (uint256) {
        return x * x;
    }
    
    function testInternalCall(uint256 x) public pure returns (uint256) {
        return internalHelper(x);
    }
}