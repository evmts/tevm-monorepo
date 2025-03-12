// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ContractB.sol";

contract ContractA {
    ContractB private contractB;
    
    function setContractB(address _contractB) public {
        contractB = ContractB(_contractB);
    }
    
    function callBFunction() public view returns (string memory) {
        return contractB.getMessageFromB();
    }
    
    function getMessageFromA() public pure returns (string memory) {
        return "Hello from Contract A";
    }
}