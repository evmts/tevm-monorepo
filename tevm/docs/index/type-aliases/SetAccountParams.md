[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / SetAccountParams

# Type alias: SetAccountParams\<TThrowOnFail\>

> **SetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Tevm params to set an account in the vm state
all fields are optional except address

## Example

```ts
const accountParams: import('tevm/api').SetAccountParams = {
  account: '0x...',
  nonce: 5n,
  balance: 9000000000000n,
  storageRoot: '0x....',
  deployedBytecode: '0x....'
}
```

## Type declaration

### address

> **address**: [`Address`](Address.md)

Address of account

### balance?

> `optional` **balance**: `bigint`

Balance to set account to

### deployedBytecode?

> `optional` **deployedBytecode**: [`Hex`](Hex.md)

Contract bytecode to set account to

### nonce?

> `optional` **nonce**: `bigint`

Nonce to set account to

### state?

> `optional` **state**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

key-value mapping to override all slots in the account storage before executing the calls

### stateDiff?

> `optional` **stateDiff**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

key-value mapping to override individual slots in the account storage before executing the calls

### storageRoot?

> `optional` **storageRoot**: [`Hex`](Hex.md)

Storage root to set account to

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions-types/types/params/SetAccountParams.d.ts:16
