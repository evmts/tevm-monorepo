// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Minimal ERC20 Wrapper
contract TestERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}

// Minimal ERC721 Wrapper
contract TestERC721 is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
}