// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contract_D2_I3 {
    string public name = "Contract_D2_I3";
    
    function getName() public view returns (string memory) {
        return name;
    }
}