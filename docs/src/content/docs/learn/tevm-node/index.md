---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---
# TevmNode

A lightweight performant JavaScript native Ethereum Virtual Machine (EVM) enabling next-generation local-first UX for end users.

## Summary

TevmNode is a local evm blockchain instance with a focus on delivering optimal UX in the browser. With TevmNode you can build performant, robust, local-first user experiences. Your users are going to be delighted by your applications.

Examples of UX you can deliver with Tevm Node:

- Deliver faster JSON-RPC responses via local execution
- Instant spinner free gas estimation without an RPC
- Easily show users every storage slot and event a transaction is expected to trigger
- Build a UI that optimistically updates when transactions are made
- Execute unsupported JSON-RPC methods locally
- Calculate advanced multitransaction gas estimation

:::[tip] Viem and Ethers versions
If you are already using Viem or Ethers.js in your application it's recomended you use the viem or ethers api. These apis support the entire TevmNode api as well as the Viem and Ethers apis you are already using.

Here are your options:

- TevmNode - the lowest level api
- Viem client + TevmTransport - The recomended api for most users. Tree shakable and supports the entire viem API
- MemoryClient - A batteries included viem client. Not tree shakable but extremely quick and easy to use if tree shaking is not a concern
- TevmProvider - An ethers.js implementation of Tevm
:::
or ethers providers tevm node is available on `Provider.tevm`

## Motivation

Here are the guiding principles TevmNode follows

- Lightweight and TreeShakable - TevmNode relentlessly improves tree shakability and constantly working with sub dependencies to reduce bundle size impact
- Modular - TevmNode is built of modular components that follow the [EthereumJS api](https://github.com/ethereumjs). Each component can be replace or extended.
- Powerful and low level - TevmNode exposes all the apis higher level abstractions such as the JSON-RPC api are built with empowering devs to build without roadblocks

## Enough talk show some code!

In the example below we are using TevmNode to fork optimism and run a transaction. This is using low level TevmNode apis.

- [Open in stackblitz](https://todo.todo.todo)

```typescript
import { http, createTevmNode, PREFUNDED_ACCOUNTS } from 'tevm'
import { runTx } from 'tevm/vm'
import { createImpersonatedTx } from 'tevm/tx'
import { createAddress } from 'tevm/address'
import { optimism } from 'tevm/common'

// Create a new ethereum node and fork optimism
const node = createTevmNode({
  common: optimism,
  fork: {
    transport: http('https://mainnet.optimism.io')
  }
})

// Get the internal vm
const vm = await node.getVm()

const toAddress = createAddress(`0x${'69'.repeat(20)}`)

// Create an impersonation transaction. This is an unsigned transaction that the node will treat as signed
// Other supported types of Transactions include EIP1559Transaction and EIP4844Transaction
const tx = createImpersonatedTx({
	impersonatedAddress: createAddress(PREFUNDED_ACCOUNTS[0].address),
	nonce: 0,
	gasLimit: 21064,
	maxFeePerGas: 8n,
	maxPriorityFeePerGas: 1n,
	to: toAddress,
	value: 420n,
})

// Fetch any block from the chain by tag number or block hash
const block = await vm.blockchain.getBlockByTag('latest')

// runTx is the lowest level way in Tevm to execute a transaction within the VM
const result = await runTx(vm)({
  tx,
  block,
  skipNonce: true,
  skipBlockGasLimitValidation: true,
  reportAccessList: true,
  reportPreimages: true,
})

// All state such as account state and contract storage is on the stateManager
const {balance} = await vm.stateManager.getAccount(toAddress)
console.log(balance) // 420n
```

Note: this is just one way to interact with TevmNode. Tree shakable extensions exist for using a higher level apis such as the Ethereum JSON-RPC api.

