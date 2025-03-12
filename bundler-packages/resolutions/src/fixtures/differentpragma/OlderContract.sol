// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

contract OlderContract {
    function getMessage() public pure returns (string memory) {
        return "I'm using an older Solidity version";
    }
}