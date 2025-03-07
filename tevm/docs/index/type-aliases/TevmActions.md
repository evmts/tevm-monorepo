[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmActions

# Type Alias: TevmActions

> **TevmActions**: `object`

Defined in: packages/memory-client/types/TevmActions.d.ts:10

Provides powerful actions for interacting with the EVM using the TEVM API.
These actions allow for low-level access to the EVM, managing accounts, deploying contracts, and more.

## Type declaration

### tevm

> **tevm**: [`TevmNode`](TevmNode.md) & [`Eip1193RequestProvider`](Eip1193RequestProvider.md)

Low level access to TEVM can be accessed via `tevm`. These APIs are not guaranteed to be stable.

#### See

[TevmNode](TevmNode.md)

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const memoryClient = createMemoryClient()

// low level access to the TEVM VM, blockchain, EVM, stateManager, mempool, receiptsManager and more are available
const vm = await memoryClient.tevm.getVm()
vm.runBlock(...)
const { blockchain, evm, stateManager } = vm
blockchain.addBlock(...)
evm.runCall(...)
stateManager.putAccount(...)

const mempool = await memoryClient.tevm.getTxPool()
const receiptsManager = await memoryClient.tevm.getReceiptsManager()
```

### tevmCall

> **tevmCall**: [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\]

A powerful low level API for executing calls and sending transactions.
See [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference.
See [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) for return values reference.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import { ERC20 } from 'tevm/contract'

const client = createMemoryClient()

const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)

await client.setAccount(token)

const balance = await client.tevmCall({
  to: token.address,
  data: encodeFunctionData(token.read.balanceOf, [token.address]),
})
```
In addition to making basic calls, you can also do advanced things like:
- Impersonate accounts via passing in `from`, `caller`, or `origin`
- Set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- Send as a transaction with `createTransaction: true`
For all options see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)

### tevmContract

> **tevmContract**: [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\]

A powerful low level API for calling contracts. Similar to `tevmCall` but takes care of encoding and decoding data, revert messages, etc.
See [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
See [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import { ERC20 } from './MyERC721.sol'

const client = createMemoryClient()
const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)
await client.setAccount(token)
const balance = await client.tevmContract({
  contract: token,
  method: token.read.balanceOf,
  args: [token.address],
})
```
In addition to making basic calls, you can also do advanced things like:
- Impersonate accounts via passing in `from`, `caller`, or `origin`
- Set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- Send as a transaction with `createTransaction: true`
For all options see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)

### tevmDeploy

> **tevmDeploy**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\]

Deploys a contract to the EVM with encoded constructor arguments. Extends `tevmCall` so it supports all advanced options.

#### See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import { ERC20 } from './MyERC721.sol'

const client = createMemoryClient()
const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)

const deploymentResult = await client.tevmDeploy({
  abi: token.abi,
  bytecode: token.bytecode,
  args: ['TokenName', 18, 'SYMBOL'],
})

console.log(deploymentResult.createdAddress)
```

### tevmDumpState

> **tevmDumpState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\]

Dumps a JSON serializable state from the EVM. This can be useful for persisting and restoring state between processes.

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'
const client = createMemoryClient()
const state = await client.tevmDumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

### tevmGetAccount

> **tevmGetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\]

Gets the account state of an account. It does not return the storage state by default but can if `returnStorage` is set to `true`.
In forked mode, the storage is only the storage TEVM has cached and may not represent all the on-chain storage.

#### See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

const account = await client.tevmGetAccount({
  address: `0x${'0000'.repeat(10)}`,
  returnStorage: true,
})
```

### tevmLoadState

> **tevmLoadState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\]

Loads a JSON serializable state into the EVM. This can be useful for persisting and restoring state between processes.

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'

const client = createMemoryClient()

const state = fs.readFileSync('state.json', 'utf8')

await client.tevmLoadState(state)
```

### tevmMine

> **tevmMine**: [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\]

Mines a new block with all pending transactions. In `manual` mode you must call this manually before the canonical head state is updated.

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmMine()
```

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

Returns a promise that resolves when the TEVM is ready.
This is not needed to explicitly be called as all actions will wait for the TEVM to be ready.

#### Returns

`Promise`\<`true`\>

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmReady()
```
Same as calling `client.tevm.ready()`

### tevmSetAccount

> **tevmSetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\]

Sets any property of an account including its balance, nonce, contract deployedBytecode, contract state, and more.

#### See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference.
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference.

#### Example

```typescript
import { createMemoryClient, numberToHex } from 'tevm'
import { SimpleContract } from 'tevm/contract'

const client = createMemoryClient()

await client.tevmSetAccount({
  address: `0x${'0123'.repeat(10)}`,
  balance: 100n,
  nonce: 1n,
  deployedBytecode: SimpleContract.deployedBytecode,
  state: {
    [`0x${'0'.repeat(64)}`]: numberToHex(420n),
  }
})
```

## See

 - [Actions Guide](https://tevm.sh/learn/actions/)
 - [Viem Actions API](https://viem.sh/docs/actions/introduction)
