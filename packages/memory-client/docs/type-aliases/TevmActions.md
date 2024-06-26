[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / TevmActions

# Type Alias: TevmActions

> **TevmActions**: `object`

Powerful actions for interacting with the EVM

## Type declaration

### \_tevm

> **\_tevm**: `BaseClient` & `Eip1193RequestProvider` & `TevmActionsApi` & `object`

Low level access to tevm can be accessed via `tevm_tevm`. These apis are not guaranteed to be stable

#### See

BaseClient

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const memoryClient = createMemoryClient()

// low level access to the tevm vm, blockchain, evm, stateManager, mempool, receiptsManager and more are available
const vm = await memoryClient._tevm.getVm()
vm.runBlocl(...)
const {blockchain, evm, stateManager} = vm
blockchain.addBlock(...)
evm.runCall(...)
stateManager.putAccount(...)

const mempool = await memoryClient._tevm.getTxPool()
const receiptsManager = await memoryClient._tevm.getReceiptsManager()
````

#### Type declaration

##### request

> **request**: `EIP1193RequestFn`

##### send

> **send**: `TevmJsonRpcRequestHandler`

##### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

### tevmCall

> **tevmCall**: `TevmActionsApi`\[`"call"`\]

A powerful low level api for executing calls and sending transactions
See [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference
See [CallResult](https://tevm.sh/reference/tevm/precompiles/type-aliases/callresult/) for return values reference
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
```typescript`
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
In addiiton to making basic call, you can also do advanced things like
- impersonate accounts via passing in `from`, `caller`, or `origin`
- set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- send as a transaction with `createTransaction: true`
For all options see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
Same as calling `client._tevm.call`
`

### tevmContract

> **tevmContract**: `TevmActionsApi`\[`"contract"`\]

A powerful low level api for calling contracts. Similar to `tevmCall` but takes care of encoding and decoding data, revert messages, etc.
See [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference]
See [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
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
In addiiton to making basic call, you can also do advanced things like
- impersonate accounts via passing in `from`, `caller`, or `origin`
- set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- send as a transaction with `createTransaction: true`
For all options see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)

### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`\[`"deploy"`\]

Deploys a contract to the EVM with encoded constructor arguments. Extends `tevmCall` so it supports all advanced options

#### See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
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

console.log(deployedResult.createdAddressess)

### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`\[`"dumpState"`\]

Dumps a json serializable state from the evm. This can be useful for persisting and restoring state between processes

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'
const client = createMemoryClient()
const state = await client.tevmDumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`\[`"getAccount"`\]

Gets the account state of an account
It does not return the storage state by default but can if `returnStorage` is set to `true`. In forked mode the storage is only the storage
Tevm has cached and may not represent all the onchain storage.

#### See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference

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

> **tevmLoadState**: `TevmActionsApi`\[`"loadState"`\]

Loads a json serializable state into the evm. This can be useful for persisting and restoring state between processes

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'

const client = createMemoryClient()

const state = fs.readFileSync('state.json', 'utf8')

await client.tevmLoadState(state)
````

### tevmMine

> **tevmMine**: `TevmActionsApi`\[`"mine"`\]

Mines a new block with all pending transactions. In `manual` mode you must call this manually before the cannonical head state is updated

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmMine()
```

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

Returns a promise that resolves when the tevm is ready
This is not needed to explicitly be called as all actions will wait for the tevm to be ready

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmReady()
```
Same as calling `client._tevm.ready()`

#### Returns

`Promise`\<`true`\>

### ~~tevmScript~~

> **tevmScript**: `TevmActionsApi`\[`"script"`\]

#### Deprecated

in favor of tevmContract. To migrate simply replace `tevmScript` with `tevmContract` as the api is supported and more
tevmContract also now supports deploying contracts with constructor arguments too via `params.code`. TevmScript previously did not support this
and only supported deployedBytecode with no constructor arguments. tevmContract supports using deployedBytecode as waell.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
```typescript
import { createMemoryClient } from 'tevm'`
import { ERC20 } from './MyERC721.sol'

const client = createMemoryClient()

const balance = await client.tevmContract({
  createTransaction: true,
  deployedBytecode: ERC20.deployedBytecode,
  abi: ERC20.abi,
  method: 'mint',
  args: [client.address, 1n],
})
```
Same as calling `client._tevm.script`
`

### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`\[`"setAccount"`\]

Sets any property of an account including
- it's balance
- It's nonce
- It's contract deployedBytecode
- It's contract state
- more

#### See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference]
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference

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

## Defined in

[packages/memory-client/src/TevmActions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L8)
