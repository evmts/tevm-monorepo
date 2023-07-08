// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script} from "forge-std/src/Script.sol";
import {WagmiMintExample} from "../src/contracts/WagmiMintExample.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        WagmiMintExample wagmiMintExample = new WagmiMintExample();

        vm.stopBroadcast();
    }
}
