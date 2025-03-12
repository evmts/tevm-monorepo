// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "/Users/williamcory/tevm-monorepo/bundler-packages/resolutions/src/fixtures/basic/Contract.sol";
import "/Users/williamcory/absolute/path/to/some/contract.sol";

contract ContractWithAbsoluteImports {
    function getMessage() public pure returns (string memory) {
        return "This contract uses absolute import paths";
    }
}