// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import {Fs} from "./Fs.s.sol";

contract WriteHelloWorld {
    function write(Fs fs) public {
        fs.writeFile("./test.txt", "Hello world");
    }
}
