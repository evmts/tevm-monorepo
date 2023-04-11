# Get Started

Welcome to the EVMts docs!

::: tip
The stackblitz demo at the bottom of this page is the quickest way to get introduced to EVMts
:::

## Overview

EVMts brings the developer experience of Forge scripts to the browser.

- _Game-changing ux_ such as the ability simulate transactions locally and quickly surface any information about the events emitted
- _Blazing fast_ execution of the EVM local in the browser. Faster gas estimation, no unnecessary RPC requests.
- _A new paradigm_ for developer experience. ABIs melt away with the ability to import contracts directly
- _Powerful but simple_ api for interacting with the EVM including the [forge cheat codes](https://book.getfoundry.sh/forge/cheatcodes)

Check out [Why EVMts](./intro.md) for a more detailed breakdown of the power of using EVMts to power your applications

## How to use EVMts

### 1. First write a script in solidity

```solidity [TransferAllScript.s.sol]
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransferOneToken is Script {
    function run(ERC20 contract, address recipient) external {
        address signer = vm.envUint("EVMTS_SIGNER");
        uint256 amount = 1;

        vm.startBroadcast(signer);

        contract.transferFrom(signer, recipient, totalBalance);

        vm.stopBroadcast();
    }
}
```

### 2. Now import the script and execute it

```ts [example.ts]
import { execute } from "@evmts/core";
import { TransferAllScript } from "./TransferAllScript.s.sol";
import { client } from "./client";

client.mutate({
  script: TransferAllScript,
  args: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', '0x6387a88a199120aD52Dd9742C7430847d3cB2CD4'];
}).broadcast().then(({txHash}) => {
  console.log(txHash)
})
```

## Try EVMts now

You don't need to install anything just to play with EVMts! Try editing this sandbox.

[TODO](https://github.com/evmts/evmts-monorepo/issues/10)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/edit/github-dluehe-d7t42l?file=README.md"></iframe>
