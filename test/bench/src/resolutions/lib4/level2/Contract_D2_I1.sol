// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contract_D2_I1 {
    string public name = "Contract_D2_I1";
    
    function getName() public view returns (string memory) {
        return name;
    }
}