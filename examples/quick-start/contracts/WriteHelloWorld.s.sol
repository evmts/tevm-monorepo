// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import {Fs} from "./Fs.sol";

/// @title WriteHelloWorld Contract
/// @notice This contract writes a "Hello world" message to a file.
/// @dev This contract depends on the Fs contract to write files.
contract WriteHelloWorld {
    
    /// @notice Writes "Hello world" to a file named "test.txt".
    /// @dev Uses the Fs contract to write the file.
    /// @param fs An instance of the Fs contract.
    function hello(Fs fs, string calldata path, string calldata data) public {
        fs.writeFile(path, data);
    }
}
