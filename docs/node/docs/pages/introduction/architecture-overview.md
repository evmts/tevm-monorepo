---
title: Architecture Overview
description: A high-level overview of how Tevm Node works and its available APIs
---

# Architecture Overview

These are advanced docs for those looking to contribute to Tevm or those looking to learn more about it's internals.  These docs will go into the low level architecture of [TevmNode](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/docs/type-aliases/TevmNode.md). To focus on the high level api go straight to the [viem docs](../examples/viem.mdx).

Note: for most people it is recomended to use the higher level [viem api](../getting-started/viem.mdx). 

## Actions api

To focus on being tree shakable, Tevm is broken up into Objects and Actions. This pattern will be familiar to those who have used [viem](https://viem.sh/).

### Objects

Objects in Tevm are:
- Stateful components that maintain data and state
- Come in tree shakable forms or with actions on the object
- Similar to structs in other languages

### Actions

Actions in Tevm are:
- Pure functions that take an object as their first parameter
- Tree-shakable operations that can be imported individually
- Can also optionally be on prototype
- Single-purpose utilities that perform specific tasks
- Composable pieces that can be combined for complex operations

For example, an action like `getAccountHandler` takes a `TevmNode` object and returns a function for getting account details:

Objects in Tevm include:

- [`TevmNode`](/reference/node)
- Low level Node components such as [`Evm`](/reference/evm) and [`Blockchain`](/reference/blockchain)
- Tevm shares objects with viem such as the [ViemClient](https://viem.sh/docs/clients/public.html)

These objects have tree shakable actions that can be imported from their respective actions. Here's an example:

```typescript
import { createTevmNode } from 'tevm'
import { getAccountHandler } from 'tevm/actions'

const node = createTevmNode()
const getAccount = getAccountHandler(node)

// Use the action
const account = await getAccount({
  address: '0x...'
})
```

The most important actions are the `TevmNode` actions from [`tevm/actions`](/reference/actions). There are also viem actions in [tevm/memory-client](/reference/memory-client).

## MemoryClient

MemoryClient is a viem client with every viem and tevm action included on prototype so you don't need to import them as actions. This is more convenient but less tree shakable.

```typescript
import { createMemoryClient } from 'tevm/memory-client'

const client = createMemoryClient()

// All viem actions are available directly on memory client
await client.getContractCode({
  address: '0x...'
})

// custom tevm actions corresponding to the most popular TevmNode actions
// are available prefixed with tevm
const state = await client.tevmDumpState()
```

See [viem guide on tree shakable actions](https://wagmi.sh/react/guides/viem) for more.

To use in tree shakable way you must create a TevmTransport and pass that into `createClient`. See [viem tevm docs](../examples/viem.mdx)

## What is Tevm Node?

[Tevm Node](https://github.com/evmts/tevm-monorepo) is a JavaScript implementation of an Ethereum node that can run in any JavaScript environment - browsers, Node.js, or other runtimes. It provides a complete [Ethereum Virtual Machine (EVM)](https://ethereum.org/en/developers/docs/evm/) with state management, transaction processing, and JSON-RPC support.

To use in tree shakable way simply import actions to use with tevm node

```typescript
// create a tevm node
import {createTevmNode} from 'tevm'
// import actions from tevm/actions
import {getAccountHandler} from 'tevm/actions'

const node = createTevmNode()

const getAccount = getAccountHandler(node)

const account = getAccount({address: `0x...`})
```

You can also interact with lower level components like evm, statemanager, blockchain and more via [advanced apis](../reference/index.mdx).

## What can you do with Tevm Node?

Tevm has a lot of use cases many which are covered in the examples section

1. Anything viem can do as tevm is an extension of viem's capabilities
2. Simulate blocks and transactions locally. Hook directly into evm execution
3. Estimate gas with no network requests and no loading setupEventListeners
4. Build an EVM simulator like [svvy.sh](https://svvy.sh)
5. Test your JavaScript against an anvil compatible fork in JavaScript
6. Debug evm tx step by step
7. Optimistic ui updates when tx are sent
8. And more!

## Core Architecture

[TevmNode](/reference/node) is built on several key components that work together:

### 1. Virtual Machine (EVM)
- Core execution engine that runs [EVM bytecode](https://ethereum.org/en/developers/docs/evm/opcodes/)
- Handles state transitions and gas metering
- Based on [`@ethereumjs/evm`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)

Example usage:
```typescript
const vm = await node.getVm()
const result = await vm.runCode({
  code: '0x60806040...',
  gasLimit: 21000n
})
```

### 2. State Manager
- Manages account balances, contract code, and storage
- Supports forking from live networks
- Implements caching and lazy loading

See [State](/reference/state) for api info

### 3. Transaction Pool (Mempool)
- Manages pending transactions
- Orders transactions by gas price
- Validates transaction requirements

See [Transaction Pool](/reference/txpool) for api info

### 4. Blockchain
- Maintains block history and chain state
- Handles block production (mining)
- Manages chain reorganizations

See [Blockchain](/reference/blockchain) for api info

### 5. Receipts Manager
- Caches transaction outcomes
- Manages event logs and filters
- Useful for implementing optimistic updates

See [Receipt Manager](/reference/receipt-manager) for api info

## Available APIs

Tevm Node provides several layers of APIs for different use cases:

### 1. High-Level Actions

Most functionality in Tevm is done via tree shakable actions including JSON-RPC compatabile actions.

The most commonly used actions are provided as handlers:

```ts
import { createTevmNode } from 'tevm'
import { callHandler, mineHandler, getAccountHandler } from 'tevm/actions'

// Create a Tevm node
const node = createTevmNode()

// Execute contract calls
const result = await callHandler(node)({
  to: contractAddress,
  data: calldata
})

// Mine pending transactions
await mineHandler(node)()

// Read account state
const account = await getAccountHandler(node)({
  address: accountAddress
})
```

### 2. JSON-RPC Interface

```ts
import { requestEip1193 } from 'tevm/decorators'

const node = createTevmNode().extend(requestEip1193())

// Standard Ethereum JSON-RPC calls
const balance = await node.request({
  method: 'eth_getBalance',
  params: [address, 'latest']
})
```

### 3. Direct VM Access

```ts
const vm = await node.getVm()

// Low-level EVM execution
const result = await vm.runTx({
  tx: transaction,
  block: block
})

// State management
await vm.stateManager.putAccount(address, account)
```

### 4. Contract Utilities

```typescript
import { createContract } from 'tevm/contract'

// Type-safe contract interactions
const contract = createContract({
  humanReadableAbi: ['function transfer(address to, uint256 amount)'],
  address: '0x123...'
})

// Write operations
const action = contract.write.transfer('0x456...', 100n)

// Read operations
const balance = await contract.read.balanceOf('0x789...')
```

You can also use the tevm bundler for automatic contract compilation:

```typescript
// Import Solidity contracts directly
import { ERC20 } from './ERC20.sol'

// Contract type information is automatically generated
const contract = createContract({
  abi: ERC20.abi,
  address: '0x123...'
})
```

## Key Features

### 1. Forking
Fork from any live network or another Tevm instance:

```ts
const node = createTevmNode({
  fork: {
    transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
    blockTag: 'latest'
  }
})
```

### 2. Mining Modes
Configure how transactions are processed:

```ts
const node = createTevmNode({
  miningConfig: {
    type: 'auto' // Mine every transaction
    // Or 'interval', 'manual', 'gas'
  }
})
```

### 3. Custom Precompiles
Extend the EVM with JavaScript functions:

```ts
const precompile = definePrecompile({
  address: '0x123...',
  call: async (input) => {
    // Custom logic
    return {
      returnValue: result,
      executionGasUsed: 100n
    }
  }
})
```

### 4. State Management
Direct control over blockchain state:

```ts
// Modify account state
await node.setAccount({
  address: '0x123...',
  balance: 100n,
  code: '0x...',
  storage: { /* ... */ }
})

// Create checkpoints
await vm.stateManager.checkpoint()
await vm.stateManager.commit() // or .revert()
```

## Common Use Cases

1. **Local Development**
   - Run a complete Ethereum environment locally
   - Test contracts without external networks
   - Simulate complex scenarios

2. **Testing**
   - Unit test smart contracts
   - Integration test DApp interactions
   - Fork mainnet for realistic tests

3. **Transaction Simulation**
   - Preview transaction outcomes
   - Estimate gas costs accurately
   - Debug failed transactions

4. **State Manipulation**
   - Modify account balances
   - Override contract state
   - Test edge cases

## Integration Examples

### With Viem

```typescript
import { createPublicClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Create a Tevm node
const node = createTevmNode({
  fork: {
    url: 'https://mainnet.infura.io/v3/YOUR-KEY'
  }
})

// Create a viem client using Tevm
const client = createPublicClient({
  transport: custom(node.request),
  chain: mainnet
})

// Use viem actions
const balance = await client.getBalance({
  address: '0x...'
})
```

### With Ethers.js

```typescript
import { BrowserProvider } from 'ethers'

const node = createTevmNode()
const provider = new BrowserProvider(node)

// Use ethers.js functionality
const balance = await provider.getBalance('0x...')
const block = await provider.getBlock('latest')
```

## Next Steps

- [Core Concepts](../core/create-tevm-node)
- [Viem docs](../examples/viem.mdx)
- [API Reference](../api/methods)
- [Examples](../examples/local-testing)
- [GitHub Repository](https://github.com/evmts/tevm-monorepo)
