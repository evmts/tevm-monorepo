// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Precompile for console.log
interface Console {
    function log() external;
    function log(uint256) external;
    function log(string memory) external;
    function log(bool) external;
    function log(address) external;
    function log(bytes memory) external;
}


contract EmptyRunner {
    function run() public {
    }
}

contract RunEmpty {
    EmptyRunner public immutable runner;
    Console private immutable console;

    constructor(Console _console) {
        runner = new EmptyRunner();
        console = _console;
    }

    function run() public {
       console.log(gasleft());
       address(runner).call(abi.encodeCall(EmptyRunner.run, ()));
       console.log(gasleft());
    }
}