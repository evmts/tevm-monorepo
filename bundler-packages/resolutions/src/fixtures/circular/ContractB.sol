// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ContractA.sol";

contract ContractB {
    ContractA private contractA;
    
    function setContractA(address _contractA) public {
        contractA = ContractA(_contractA);
    }
    
    function callAFunction() public view returns (string memory) {
        return contractA.getMessageFromA();
    }
    
    function getMessageFromB() public pure returns (string memory) {
        return "Hello from Contract B";
    }
}