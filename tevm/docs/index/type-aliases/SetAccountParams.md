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

> `readonly` **address**: [`Address`](Address.md)

Address of account

### balance?

> `optional` `readonly` **balance**: `bigint`

Balance to set account to

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](Hex.md)

Contract bytecode to set account to

### nonce?

> `optional` `readonly` **nonce**: `bigint`

Nonce to set account to

### state?

> `optional` `readonly` **state**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

key-value mapping to override all slots in the account storage before executing the calls

### stateDiff?

> `optional` `readonly` **stateDiff**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

key-value mapping to override individual slots in the account storage before executing the calls

### storageRoot?

> `optional` `readonly` **storageRoot**: [`Hex`](Hex.md)

Storage root to set account to

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions-types/types/params/SetAccountParams.d.ts:16
