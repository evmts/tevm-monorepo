// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Counter {
    uint256 public count = 0;

    event CountIncremented(address indexed messageSender);

    event CountDecremented(address indexed messageSender);

    function plusOne() public {
        count += 1;
        emit CountIncremented(msg.sender);
    }

    function minusOne() public {
        count -= 1;
        emit CountDecremented(msg.sender);
    }
}
