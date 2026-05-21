// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

// Utility library for mathematical operations
library MathUtils {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function multiply(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function percentage(uint256 value, uint256 percent) internal pure returns (uint256) {
        return (value * percent) / 100;
    }
}
