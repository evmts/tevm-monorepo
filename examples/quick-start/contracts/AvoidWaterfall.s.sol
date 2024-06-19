// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract AvoidWaterfall {
    function balanceOfOwnerOf(IERC721 tokenContract, uint256 tokenId) external view returns (uint256) {
        address owner = tokenContract.ownerOf(tokenId);
        uint256 balance = tokenContract.balanceOf(owner);
        return balance;
    }
}

