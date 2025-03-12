// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./level1/ContractLevel1.sol";

contract MainContract {
    ContractLevel1 private level1Contract;
    
    constructor() {
        level1Contract = new ContractLevel1();
    }
    
    function getMessageChain() public view returns (string memory) {
        return level1Contract.getLevel1AndBelowMessages();
    }
}