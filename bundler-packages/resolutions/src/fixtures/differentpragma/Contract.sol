// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./OlderContract.sol";

contract NewerContract {
    OlderContract private olderContract;
    
    constructor() {
        olderContract = new OlderContract();
    }
    
    function getOlderContractMessage() public view returns (string memory) {
        return olderContract.getMessage();
    }
    
    function getNewerMessage() public pure returns (string memory) {
        return "I'm using a newer Solidity version";
    }
}