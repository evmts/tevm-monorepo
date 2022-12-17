//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/* Testing utilities */
import { Test } from "forge-std/Test.sol";
import { Script } from "../src/Script.sol";

contract Script_Initializer is Test {
    address alice = address(128);
    Script script;

    function _setUp() public {
        vm.label(alice, "alice");
        script = new Script();
    }
}

contract ScriptTest is Script_Initializer {
    function setUp() public {
        super._setUp();
    }

    function test_Script() external {
        // assertEq('TODO', 'TODO');
    }
}
