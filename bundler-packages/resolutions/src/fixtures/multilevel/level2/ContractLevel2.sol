// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../level3/ContractLevel3.sol";

contract ContractLevel2 {
    ContractLevel3 private level3Contract;
    
    constructor() {
        level3Contract = new ContractLevel3();
    }
    
    function getLevel2AndBelowMessages() public view returns (string memory) {
        return string(abi.encodePacked(
            "Level 2 says hello, ", 
            level3Contract.getMessage()
        ));
    }
}