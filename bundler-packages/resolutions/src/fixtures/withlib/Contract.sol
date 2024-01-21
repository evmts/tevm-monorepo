// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import {BaseContract} from "mylib/BaseContract.sol"

// Derived contract that inherits from BaseContract
contract DerivedContract is BaseContract {

    // This variable is additional to the one in the BaseContract
    string public name;

    constructor(uint256 _value, string memory _name) BaseContract(_value) {
        name = _name;
    }

    function setName(string memory _name) public {
        name = _name;
    }
}

