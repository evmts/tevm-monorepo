---
title: Overview
description: A JavaScript-compatible Ethereum Virtual Machine with forking capabilities
---

import { Callout } from 'vocs/components'

# Overview

Tevm Node is an Ethereum Node that runs in all JavaScript environments.
It's like [hardhat](https://hardhat.org/) or [anvil](https://book.getfoundry.sh/anvil/), but provides these advantages:

- Zero native dependencies (runs in browser and Node.js)
- Connects directly to [`viem`](https://viem.sh/) or [`ethers`](https://docs.ethers.org/v6/)
- Provides fine-grained control over the EVM execution environment for advanced use cases and speedy ux
- Implement advanced feature like zero-spinner gas estimation, optimistic updates, and advanced transaction simulation

If you know how to use `viem` or `ethers`, you already know how to use Tevm Node and can get started right away.

## Quick Example

The following code simple deploys, writes, and reads from a contract.

- The API for interacting with Tevm is [viem](https://viem.sh)
- TevmNode runs an ethereum node in memory rather than using json-rpc over http

```ts
import { createMemoryClient, PREFUNDED_ACCOUNTS } from 'tevm'
import { SimpleContract } from 'tevm/contract'

const client = createMemoryClient()

const contract = SimpleContract.withAddress(`0x${'40'.repeat(20)}`)

await client.setCode({
  address: contract.address,
  bytecode: contract.deployedBytecode,
})

await client.writeContract({
  account: PREFUNDED_ACCOUNTS[0],
  abi: contract.abi,
  functionName: 'set',
  args: [420n],
  address: contract.address,
})

await client.tevmMine()

const value = await client.readContract({
  abi: contract.abi,
  functionName: 'get',
  address: contract.address,
})

console.log(value)
```

If you don't know how to use `viem` or `ethers`, don't worry, Tevm is a great way to learn both Ethereum and TypeScript.
