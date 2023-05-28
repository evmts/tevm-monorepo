# Get Started

Welcome to the EVMts docs!

## Overview

EVMts brings the EVM to the browser.

- **Execute solidity scripts** as a [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) in your TypeScript applications
- **Import Solidity directly** ABIs melt away with the ability to import contracts directly
- **Simple yet powerful** api including [forge cheat codes](https://book.getfoundry.sh/forge/cheatcodes)
- **Optimistic execution** of the EVM within the browser with [rEVM](https://github.com/bluealloy/revm)

::: tip
Just want to try it out?

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/evmts/evmts-monorepo)
:::

## EVMts is simple

### 1. First write a script in solidity

Scripts in EVMts work exactly like [forge scripts](https://book.getfoundry.sh/tutorials/solidity-scripting)

```solidity [Example.s.sol]
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Example is Script {
    function run(ERC20 erc20Contract, address recipient, uint256 amount) external {
        address signer = vm.envAddress("SIGNER");
        vm.startBroadcast(signer);
        erc20Contract.transferFrom(signer, recipient, amount);
        vm.stopBroadcast();
    }
}
```

### 2. Then execute your script in TypeScript

- no code gen step
- no abis
- no boilerplate

Just import your script and run it.

```ts [example.ts]
import { Example } from "./Example.s.sol";
import { evmts } from "./evmts";
import { Address } from "@evmts/core";

const tokenAddress: Address = "0x4200000000000000000000000000000000000042";
const recipient: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const amount = BigInt(420);

evmts
  .script(Example)
  .run(tokenAddress, receipeint, amount)
  .broadcast()
  .then(({ txHash }) => {
    console.log(txHash);
  });
```

## Try EVMts now

Just looking to try out EVMts? Try editing this sandbox or continue on for installation instructions

[TODO](https://github.com/evmts/evmts-monorepo/issues/10)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/github/evmts/evmts-monorepo"></iframe>

