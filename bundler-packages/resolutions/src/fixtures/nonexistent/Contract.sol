// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./NonExistentContract.sol";
import "@non-existent-package/contracts/Token.sol";

contract ContractWithMissingImports {
    function getMessage() public pure returns (string memory) {
        return "This contract imports files that don't exist";
    }
}