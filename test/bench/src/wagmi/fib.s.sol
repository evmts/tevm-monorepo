// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fibonacci {
    function calculate(uint n) public pure returns (uint) {
        if (n == 0) return 0;
        if (n == 1) return 1;

        uint a = 0;
        uint b = 1;
        for (uint i = 2; i <= n; i++) {
            uint c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}

