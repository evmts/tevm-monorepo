pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Example is Script {
    function run(
        ERC20 erc20Contract,
        address recipient,
        uint256 amount
    ) external {
        address signer = vm.envUint("SIGNER");
        vm.startBroadcast(signer);
        erc20Contract.transferFrom(signer, recipient, amount);
        vm.stopBroadcast();
    }
}
