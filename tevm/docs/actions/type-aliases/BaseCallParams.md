[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / BaseCallParams

# Type Alias: BaseCallParams\<TThrowOnFail\>

> **BaseCallParams**\<`TThrowOnFail`\>: [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnFail`\> & `object`

Defined in: packages/actions/dist/index.d.ts:461

Properties shared across call-like params.
This type is used as the base for various call-like parameter types:
- [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams-1/)
- [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams-1/)
- [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams-1/)
- [ScriptParams](https://tevm.sh/reference/tevm/actions/type-aliases/scriptparams-1/)

## Type declaration

### blobVersionedHashes?

> `readonly` `optional` **blobVersionedHashes**: [`Hex`](Hex.md)[]

Versioned hashes for each blob in a blob transaction for EIP-4844 transactions.

### blockOverrideSet?

> `readonly` `optional` **blockOverrideSet**: [`BlockOverrideSet`](BlockOverrideSet.md)

The fields of this optional object customize the block as part of which the call is simulated.
The object contains fields such as block number, hash, parent hash, nonce, etc.
This option cannot be used when `createTransaction` is set to `true`.
Setting the block number to a past block will not run in the context of that block's state. To do that, fork that block number first.

#### Example

```ts
const blockOverride = {
  number: "0x1b4",
  hash: "0x...",
  parentHash: "0x...",
  nonce: "0x0000000000000042",
}
const res = await client.call({ address: '0x1234', data: '0x1234', blockOverrideSet: blockOverride })
```

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

The block number or block tag to execute the call at. Defaults to `latest`.
- `bigint`: The block number to execute the call at.
- `Hex`: The block hash to execute the call at.
- `BlockTag`: The named block tag to execute the call at.

Notable block tags:
- 'latest': The canonical head.
- 'pending': A block that is optimistically built with transactions in the txpool that have not yet been mined.
- 'forked': If forking, the 'forked' block will be the block the chain was forked at.

### caller?

> `readonly` `optional` **caller**: [`Address`](Address.md)

The address that ran this code (`msg.sender`). Defaults to the zero address.
If the `from` address is set, it defaults to the `from` address; otherwise, it defaults to the zero address.

### createAccessList?

> `readonly` `optional` **createAccessList**: `boolean`

Whether to return an access list mapping of addresses to storage keys.
Defaults to `false`.

#### Example

```ts
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

const { accessList } = await client.tevmCall({ to: '0x1234...', data: '0x1234', createAccessList: true })
console.log(accessList) // { "0x...": Set(["0x..."]) }
```

### createTrace?

> `readonly` `optional` **createTrace**: `boolean`

Whether to return a complete trace with the call.
Defaults to `false`.

#### Example

```ts
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

const { trace } = await client.call({ address: '0x1234', data: '0x1234', createTrace: true })

trace.structLogs.forEach(console.log)
```

### createTransaction?

> `readonly` `optional` **createTransaction**: `"on-success"` \| `"always"` \| `"never"` \| `boolean`

Whether or not to update the state or run the call in a dry-run. Defaults to `never`.
- `on-success`: Only update the state if the call is successful.
- `always`: Always include the transaction even if it reverts.
- `never`: Never include the transaction.
- `true`: Alias for `on-success`.
- `false`: Alias for `never`.

#### Example

```typescript
const { txHash } = await client.call({ address: '0x1234', data: '0x1234', createTransaction: 'on-success' })
await client.mine()
const receipt = await client.getTransactionReceipt({ hash: txHash })
```

### depth?

> `readonly` `optional` **depth**: `number`

The depth of the EVM call. Useful for simulating an internal call. Defaults to `0`.

### from?

> `readonly` `optional` **from**: [`Address`](Address.md)

The from address for the call. Defaults to the zero address for reads and the first account for writes.
It is also possible to set the `origin` and `caller` addresses separately using those options. Otherwise, both are set to the `from` address.

### gas?

> `readonly` `optional` **gas**: `bigint`

The gas limit for the call.
Defaults to the block gas limit as specified by the common configuration or the fork URL.

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

The gas price for the call.
Note: This option is currently ignored when creating transactions because only EIP-1559 transactions are supported. This will be fixed in a future release.

### gasRefund?

> `readonly` `optional` **gasRefund**: `bigint`

The refund counter. Defaults to `0`.

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: `bigint`

The maximum fee per gas for EIP-1559 transactions.

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: `bigint`

The maximum priority fee per gas for EIP-1559 transactions.

### origin?

> `readonly` `optional` **origin**: [`Address`](Address.md)

The address where the call originated from. Defaults to the zero address.
If the `from` address is set, it defaults to the `from` address; otherwise, it defaults to the zero address.

### selfdestruct?

> `readonly` `optional` **selfdestruct**: `Set`\<[`Address`](Address.md)\>

Addresses to selfdestruct. Defaults to an empty set.

### skipBalance?

> `readonly` `optional` **skipBalance**: `boolean`

Whether to skip the balance check. Defaults to `false`, except for scripts where it is set to `true`.

### stateOverrideSet?

> `readonly` `optional` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

The state override set is an optional address-to-state mapping where each entry specifies some state to be ephemerally overridden prior to executing the call. Each address maps to an object containing:
This option cannot be used when `createTransaction` is set to `true`.

#### Example

```ts
const stateOverride = {
  "0xd9c9cd5f6779558b6e0ed4e6acf6b1947e7fa1f3": {
    balance: "0xde0b6b3a7640000"
  },
  "0xebe8efa441b9302a0d7eaecc277c09d20d684540": {
    code: "0x...",
    state: {
      "0x...": "0x..."
    }
  }
}
const res = await client.call({ address: '0x1234', data: '0x1234', stateOverrideSet: stateOverride })
```

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

The address of the account executing this code (`address(this)`). Defaults to the zero address.
This is not set for create transactions but is required for most transactions.

### value?

> `readonly` `optional` **value**: `bigint`

The value in ether that is being sent to the `to` address. Defaults to `0`.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Example

```typescript
import { BaseCallParams } from 'tevm'

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
