// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ImportedContract {
    // import "./ThisShouldBeIgnored.sol";
    
    function getMessage() public pure returns (string memory) {
        return "Hello from imported contract";
    }
}