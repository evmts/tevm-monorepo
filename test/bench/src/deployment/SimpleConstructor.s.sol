// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleConstructor {
    uint256 private storedData;

    constructor(uint256 _initialValue) {
        storedData = _initialValue;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
