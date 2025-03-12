// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../level2/ContractLevel2.sol";

contract ContractLevel1 {
    ContractLevel2 private level2Contract;
    
    constructor() {
        level2Contract = new ContractLevel2();
    }
    
    function getLevel1AndBelowMessages() public view returns (string memory) {
        return string(abi.encodePacked(
            "Level 1 says hello, ", 
            level2Contract.getLevel2AndBelowMessages()
        ));
    }
}