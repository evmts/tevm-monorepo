// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Path With Spaces.sol";

contract UnusualPathUser {
    UnusualPathContract private pathContract;
    
    constructor() {
        pathContract = new UnusualPathContract();
    }
    
    function getMessage() public view returns (string memory) {
        return pathContract.getMessage();
    }
}