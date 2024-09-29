// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockReader {
    function getBlockInfo()
        public
        view
        returns (uint256, uint256, address, uint256)
    {
        return (block.number, block.timestamp, block.coinbase, block.basefee);
    }
}
