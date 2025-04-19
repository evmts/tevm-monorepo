// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Contract to demonstrate imports with storage structs
contract NFTStorage {
    // Mapping from token ID to owner address
    mapping(uint256 => address) public owners;

    // Mapping owner address to token count
    mapping(address => uint256) public balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) public tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) public operatorApprovals;
}