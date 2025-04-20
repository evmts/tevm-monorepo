// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contract_D2_I2 {
    string public name = "Contract_D2_I2";
    
    function getName() public view returns (string memory) {
        return name;
    }
}