pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts"

contract ExampleContract is ERC20 {
    constructor() ERC20("ERC20 Example", "Example 1") {
        _mint(msg.sender, 100_000_000_000 * 10**18 );
    }
}

