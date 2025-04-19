// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Contract to demonstrate imports with storage structs
contract TokenStorage {
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
}