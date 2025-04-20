// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Contract to demonstrate imports with events
contract TokenEvents {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}