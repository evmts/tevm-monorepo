# Get Started

Welcome to the EVMts docs!

## Overview

EVMts beta makes solidity a first-class citizen in TypeScript via it's build tools

- **Import Solidity directly** ABIs melt away with the ability to import contracts directly
- **Jump** directly from typescript files to contract implementation with go-to-definition
- Default **contract addresses** based on forge build artifacts

Future versions of EVMts plan to include a local VM and optimistic execution

- **PLANNED: Execute solidity scripts** as a [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) in your TypeScript applications
- **PLANNED: Optimistic execution** of the EVM within the browser with [rEVM](https://github.com/bluealloy/revm)

::: tip
Just want to try it out?

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/evmts/evmts-monorepo?configPath=examples/vite)
:::

## EVMts is simple

### 1. First write a smart contract


```solidity [MyERC20.sol]
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleContract is ERC20 {
    constructor() ERC20("ERC20 Example", "Example 1") {
        _mint(msg.sender, 100_000_000_000 * 10**18 );
    }
}
```

### 2. Deploy your contract

Deploy your contract with [forge](https://github.com/foundry-rs/foundry) and commit the deploy artifacts.

EVMts will use the deploy artifacts to configure default contract addresses for your contracts

### 3. Import your contract directly in TypeScript files and use it

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

Just looking to try out EVMts? Try editing this sandbox or continue on for installation instructions

[TODO](https://github.com/evmts/evmts-monorepo/issues/10)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/github/evmts/evmts-monorepo?configPath=examples/vite"></iframe>

