---
editUrl: false
next: false
prev: false
title: "BaseCallParams"
---

> **BaseCallParams**\<`TThrowOnFail`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnFail`\> & `object`

Properties shared across call-like params
- [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams-1/)
- [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams-1/)
- [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams-1/)
- [ScriptParams](https://tevm.sh/reference/tevm/actions/type-aliases/scriptparams-1/)

## Example

```typescript
import {BaseCalLParams} from 'tevm'

const params: BaseCallParams = {
  createTrace: true,
  createAccessList: true,
  createTransaction: 'on-success',
  blockTag: 'latest',
  skipBalance: true,
  gas: 1000000n,
  gasPrice: 1n,
  maxFeePerGas: 1n,
  maxPriorityFeePerGas: 1n,
  gasRefund: 0n,
  from: '0x123...',
  origin: '0x123...',
  caller: '0x123...',
  value: 0n,
  depth: 0,
  to: '0x123...',
}
```

## Type declaration

### blobVersionedHashes?

> `optional` `readonly` **blobVersionedHashes**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)[]

Versioned hashes for each blob in a blob transaction for 4844 transactions

### blockOverrideSet?

> `optional` `readonly` **blockOverrideSet**: [`BlockOverrideSet`](/reference/tevm/actions/type-aliases/blockoverrideset/)

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

#### Example

```ts
const blockOverride = {
 "number": "0x1b4",
 "hash": "0x
 "parentHash": "0x",
 "nonce": "0x0000000000000042",
}
const res = await client.call({address: '0x1234', data: '0x1234', blockOverrideSet: blockOverride})

### blockTag?

> `optional` `readonly` **blockTag**: [`BlockParam`](/reference/tevm/actions/type-aliases/blockparam/)

The block number or block tag to execute the call at. Defaults to `latest`.
- bigint: The block number to execute the call at
- Hex: The block hash to execute the call at
- BlockTag: The named block tag to execute the call at
Notable block tags:
- 'latest': The cannonical head
- 'pending': A block that is optimistically built with transactions in the txpool that have not yet been mined
- 'forked': If forking the 'forked' block will be the block the chain was forked at

### caller?

> `optional` `readonly` **caller**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address that ran this code (`msg.sender`). Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### createAccessList?

> `optional` `readonly` **createAccessList**: `boolean`

Whether to return an access list mapping of addresses to storage keys
Defaults to `false`

#### Example

```ts
import {createMemoryClient} from 'tevm'

const client = createMemoryClient()

const {accessList} = await client.tevmCall({to: '0x1234...', data: '0x1234', createAccessList: true})
console.log(accessList) // { "0x...": Set(["0x..."])}
```

### createTrace?

> `optional` `readonly` **createTrace**: `boolean`

Whether to return a complete trace with the call
Defaults to `false`

#### Example

```ts
import {createMemoryClient} from 'tevm'

const client = createMemoryClient()

const {trace} = await client.call({address: '0x1234', data: '0x1234', createTrace: true})

trace.structLogs.forEach(console.log)
```

### createTransaction?

> `optional` `readonly` **createTransaction**: `"on-success"` \| `"always"` \| `"never"` \| `boolean`

Whether or not to update the state or run call in a dry-run. Defaults to `never`
- `on-success`: Only update the state if the call is successful
- `always`: Always include tx even if it reverted
- `never`: Never include tx
- `true`: alias for `on-success`
- `false`: alias for `never`
Always will still not include the transaction if it's not valid to be included in
the chain such as the gas limit being too low.
If set to true and a tx is submitted the `txHash` will be returned in the response.
The tx will not be included in the chain until it is mined though

#### Example

```typescript
const {txHash} = await client.call({address: '0x1234', data: '0x1234', createTransaction: 'on-success'})
await client.mine()
const receipt = await client.getTransactionReceipt({hash: txHash})
```

### depth?

> `optional` `readonly` **depth**: `number`

Low level control over the EVM call depth. Useful if you want to simulate an internal call.
Defaults to `0`

### from?

> `optional` `readonly` **from**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The from address for the call. Defaults to the zero address on reads and account[0] on writes.
It is also possible to set the `origin` and `caller` addresses seperately using
those options. Otherwise both are set to the `from` address

### gas?

> `optional` `readonly` **gas**: `bigint`

The gas limit for the call.
Defaults to the block gas limit as specified by common or the fork url

### gasPrice?

> `optional` `readonly` **gasPrice**: `bigint`

The gas price for the call.
Note atm because only EIP-1559 tx transactions are created using the `maxFeePerGas` and `maxPriorityFeePerGas` options
this option will be ignored when creating transactions. This will be fixed in a future release

### gasRefund?

> `optional` `readonly` **gasRefund**: `bigint`

Low level control
Refund counter. Defaults to `0`

### maxFeePerGas?

> `optional` `readonly` **maxFeePerGas**: `bigint`

The maximum fee per gas for the EIP-1559 tx. This is the maximum amount of ether that can be spent on gas
for the call. This is the maximum amount of ether that can be spent on gas for the call.
This is the maximum amount of ether that can be spent on gas for the call.

### maxPriorityFeePerGas?

> `optional` `readonly` **maxPriorityFeePerGas**: `bigint`

The maximum priority fee per gas for the EIP-1559 tx.

### origin?

> `optional` `readonly` **origin**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address where the call originated from. Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### selfdestruct?

> `optional` `readonly` **selfdestruct**: `Set`\<[`Address`](/reference/tevm/actions/type-aliases/address/)\>

Addresses to selfdestruct. Defaults to the empty set.

### skipBalance?

> `optional` `readonly` **skipBalance**: `boolean`

Set caller to msg.value of less than msg.value
Defaults to false exceipt for when running scripts
where it is set to true

### stateOverrideSet?

> `optional` `readonly` **stateOverrideSet**: [`StateOverrideSet`](/reference/tevm/actions/type-aliases/stateoverrideset/)

The state override set is an optional address-to-state mapping, where each entry specifies some state to be ephemerally overridden prior to executing the call. Each address maps to an object containing:
This option cannot be used when `createTransaction` is set to `true`

The goal of the state override set is manyfold:

It can be used by DApps to reduce the amount of contract code needed to be deployed on chain. Code that simply returns internal state or does pre-defined validations can be kept off chain and fed to the node on-demand.
It can be used for smart contract analysis by extending the code deployed on chain with custom methods and invoking them. This avoids having to download and reconstruct the entire state in a sandbox to run custom code against.
It can be used to debug smart contracts in an already deployed large suite of contracts by selectively overriding some code or state and seeing how execution changes. Specialized tooling will probably be necessary.

#### Example

```ts
const stateOverride = {
  "0xd9c9cd5f6779558b6e0ed4e6acf6b1947e7fa1f3": {
    "balance": "0xde0b6b3a7640000"
  },
  "0xebe8efa441b9302a0d7eaecc277c09d20d684540": {
    "code": "0x...",
    "state": {
      "0x...": "0x..."
    }
  }
}
const res = await client.call({address: '0x1234', data: '0x1234', stateOverrideSet: stateOverride})
```

### to?

> `optional` `readonly` **to**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.
To is not set for create transactions but required for most transactions

### value?

> `optional` `readonly` **value**: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/BaseCall/BaseCallParams.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/BaseCall/BaseCallParams.ts#L35)
