// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    uint256 private value;

    event ValueSet(uint256 newValue);

    constructor(uint256 initialValue) {
        value = initialValue;
    }

    function get() public view returns (uint256) {
        return value;
    }

    function set(uint256 newValue) public {
        value = newValue;
        emit ValueSet(newValue);
    }
}
