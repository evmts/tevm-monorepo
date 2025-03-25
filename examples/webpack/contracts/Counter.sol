// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Counter {
    uint256 public count;

    constructor(uint256 _initialCount) {
        count = _initialCount;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        require(count > 0, "Cannot decrement below zero");
        count -= 1;
    }

    function reset() public {
        count = 0;
    }
}