//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/* Testing utilities */
import { Test } from "forge-std/Test.sol";
import { Counter } from "../src/contracts/Counter.sol";

contract Counter_Initializer is Test {
    event CountIncremented(
        address indexed messageSender
    );

    event CountDecremented(
        address indexed messageSender
    );


    address alice = address(128);
    Counter counter;

    function _setUp() public {
        vm.label(alice, "alice");
        counter = new Counter();
    }
}

contract CounterTest is Counter_Initializer {
    function setUp() public {
        super._setUp();
    }

    function test_Counter() external {
        assertEq(counter.count(), 0);

        vm.prank(alice);
        vm.expectEmit(true, true, false, false);
        emit CountIncremented(alice);
        counter.plusOne();

        assertEq(counter.count(), 1);

        vm.prank(alice);
        vm.expectEmit(true, true, false, false);
        emit CountDecremented(alice);
        counter.minusOne();

        assertEq(counter.count(), 0);
    }
}
