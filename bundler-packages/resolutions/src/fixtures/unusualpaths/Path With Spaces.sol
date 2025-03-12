// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract UnusualPathContract {
    function getMessage() public pure returns (string memory) {
        return "This contract has spaces in its filename";
    }
}