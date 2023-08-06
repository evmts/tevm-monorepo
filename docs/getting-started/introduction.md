# Introduction

Welcome to the EVMts Alpha docs!

::: info You will learn

1. What are Evmts imports
2. How direct solidity imports look in a basic example

:::

## Overview

EVMts makes solidity a first-class citizen in TypeScript via allowing you to import your solidity files directly into your typescript code

- **Import Solidity directly** ABIs melt away with the ability to import contracts directly
- **Jump** directly from typescript files to contract implementation with go-to-definition
- Default **contract addresses** per chain configured based on forge build artifacts

It also provides a powerful CLI for installing external contracts via a block explorer API

::: tip
Just want to try it out?

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/~/github.com/evmts/evmts-vite-wagmi-example)
:::

## Evmts is simple

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

Evmts will use the deploy artifacts to configure default contract addresses for your contracts

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
 
#### 4. Install third party contracts

The flow shown so far works best for contracts one is developing. But oftentimes we want to use third party contracts. For this functionality best practice is to use EVMts external contracts to handle this. 

External contracts can be installed using the EVMts cli. The following command installs the DAI contract into your project

```
npx evmts install --chain=1 0x6B175474E89094C44Da98b954EedeAC495271d0F
```

After installing the first time the CLI may prompt you to do some 1 time setup and then the contract can be imported directly into your solidity code.

```
import {DAI} from 'contracts/DAI'
```

## Try Evmts now

- **Learn** about Evmts by setting up a project from scratch with the [tutorial](../tutorial/overview.md)
- **Follow guides** to setup Evmts [for your project](../guides/overview.md)
- **Ask questions** about Evmts in the [discussions](https://github.com/evmts/evmts-monorepo/discussions)
- **Reference** our [reference docs](../reference/overview.md) for more detailed information

Just looking to try out Evmts? Try editing this sandbox or continue on for installation instructions

[Link to sandbox example](https://stackblitz.com/~/github.com/evmts/evmts-vite-wagmi-example)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/~/github.com/evmts/evmts-vite-wagmi-example"></iframe>

