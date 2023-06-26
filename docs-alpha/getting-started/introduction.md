# Introduction

Welcome to the EVMts Imports Beta docs!

🏗️🚧 Note: this is an early alpha release that is following documentation-driven-development. Not all features will be implemented. Unimplemented features will include a note mentioning so however 🏗️🚧 

::: info You will learn

1. What are EVMts imports
2. How direct solidity imports look in a basic example

:::

## Overview

EVMts Imports beta makes solidity a first-class citizen in TypeScript

- **Import Solidity directly** ABIs melt away with the ability to import contracts directly
- **Jump** directly from typescript files to contract implementation with go-to-definition
- Default **contract addresses** per chain configured based on forge build artifacts

::: tip
Just want to try it out?

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/evmts/evmts-monorepo?configPath=examples/vite)
:::

## EVMts is simple

### 1. First write a smart contract


```solidity [MyERC20.sol]
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() ERC20("ERC20 Example", "Example 1") {
        _mint(msg.sender, 420 * 10**18 );
    }
}
```

#### 2. Deploy your contract

Deploy your contract with [forge](https://github.com/foundry-rs/foundry) and commit the deploy artifacts.

EVMts will use the deploy artifacts to configure default contract addresses for your contracts

#### 3. Import your contract directly in TypeScript files and use it

- no code gen step
- no abis
- no boilerplate

Just import your script and use it in your React components with [wagmi](https://wagmi.sh)

```ts [example.ts]
import { MyERC20 } from './MyERC20.sol'
import { useAccount, useContractRead } from 'wagmi'

export function App() {
  const { address } = useAccount()

  const { data: tokenBalance } = useContractRead({
    ...MyERC20.balanceOf(address),
  })

  return (
    <div>Balance: {tokenBalance.toString()}</div>
  )
}

```

## Try EVMts now

- **Learn** about EVMts by setting up a project from scratch with the [tutorial](../tutorial/overview.md)
- **Follow guides** to setup EVMts [for your project](../guides/overview.md)
- **Ask questions** about EVMts in the [discussions](https://github.com/evmts/evmts-monorepo/discussions)
- **Reference** our [reference docs](../reference/overview.md) for more detailed information

Just looking to try out EVMts? Try editing this sandbox or continue on for installation instructions

[TODO](https://github.com/evmts/evmts-monorepo/issues/10)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/github/evmts/evmts-monorepo?configPath=examples/vite"></iframe>

