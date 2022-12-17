// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {AppEntrypoint} from "../src/AppEntrypoint.sol";
import {Counter} from "../src/Counter.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");


        vm.startBroadcast(deployerPrivateKey);

        AppEntrypoint appEntrypoint = new AppEntrypoint();
        Counter counter = new Counter();

        vm.stopBroadcast();
    }
}