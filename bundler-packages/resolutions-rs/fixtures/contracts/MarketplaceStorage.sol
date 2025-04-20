// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Marketplace.sol"; // Circular import to test how the resolvers handle it

// Contract to demonstrate imports with storage structs
contract MarketplaceStorage {
    // Mapping from token ID to listing details
    mapping(uint256 => Marketplace.Listing) public listings;
}