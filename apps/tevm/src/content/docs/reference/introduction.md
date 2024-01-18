## Introduction to Tevm API

Tevm is a JavaScript library for running the EVM in node, bun and the browser. It's API has the following concepts:

## Tevm

A Tevm is the API for interacting with the EVM. This includes the EVM itself but also remote clients talking to Tevm on a backend server with JSON-RPC. 

Tevms api is built from `Actions` and `Procedures`

An instance of Tevm can be created with `createTevm`

```typescript
import {createTevm} from 'tevm'

const tevm = createTevm()

console.log(
  // this is an action which we will get to soon
  await tevm.eth.blockNumber()
)   // 0
```

## Procedures

Procedures are implementations of the Tevm JSON-RPC api (the `P` in `JSON-RPC`). Tevm exposes some of the [ethereum JSON-RPC interface](https://ethereum.org/en/developers/docs/apis/json-rpc) along with custom methods such as `tevm_script` and `tevm_account`.

For the most part you will not be interacting with procedures directly but instead using the higher level `Actions` api


```typescript
import {createTevm} from 'tevm'

const tevm = createTevm()

console.log(
  await tevm.request({
    "jsonrpc": '2.0',
    "id": 1,
    "method": "eth_blockNumber",
  })
)   
```

## Actions

Actions are a pattern from [viem](https://mainnet.optimism.io) of wrapping the JSON-RPC interface with more user-friendly but still low-level apis. 

Actions exist for common ethereum actions such as:

- call
- estimateGas
- getStorageAt

And there are also powerful special tevm actions. These are:

- `script` execute an arbitrary script (similar to forge scripting)
- `contract` a typesafe interface for making contract calls
- `account` a way for the developer to modify any account in the Tevm such as modifying eth balance or adding/changing bytecode
- `block` (coming soon) a way to modify the blockchain state such as mining blocks or turning on automine

```typescript
import {createTevm, parseEth} from 'tevm'

const tevm = createTevm()

console.log(
  await tevm.account({
    "address": `0x${'1'.repeat(40)}`,
    "balance": parseEth('1')
    "deployedBytecode": "0x...",
  })
)   

```

## Action creators

Optionally, utilities are provided to further enhance the maintainability of actions. Most notably are contract action creators which provide an ergonomic typesafe streamlined way of executing contract and script actions.

```typescript
// Contract action creators can be imported directly from solidity files
// Tevm build tooling abstracts away turning the solidity code into ABI and bytecode
// JavaScript can use
import {MyContract} from './MyContract.sol'
import {createTevm} from 'tevm'

const tevm = createTevm()

// Action creators provide an intuitive and ergonomic way to dispatch actions to the EVM
await tevm.contract(
  MyContract.read.balanceOf(`0x${'0'.repeat(40)}`)
)
```

