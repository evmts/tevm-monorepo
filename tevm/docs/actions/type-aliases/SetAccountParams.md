[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SetAccountParams

# Type Alias: SetAccountParams\<TThrowOnFail\>

> **SetAccountParams**\<`TThrowOnFail`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnFail`\> & `object`

Defined in: packages/actions/types/SetAccount/SetAccountParams.d.ts:15

Tevm params to set an account in the vm state
all fields are optional except address

## Type Declaration

### address

> `readonly` **address**: [`Address`](../../index/type-aliases/Address.md)

Address of account

### balance?

> `readonly` `optional` **balance**: `bigint`

Balance to set account to

### deployedBytecode?

> `readonly` `optional` **deployedBytecode**: [`Hex`](../../index/type-aliases/Hex.md)

Contract bytecode to set account to

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Nonce to set account to

### state?

> `readonly` `optional` **state**: `Record`\<[`Hex`](../../index/type-aliases/Hex.md), [`Hex`](../../index/type-aliases/Hex.md)\>

key-value mapping to override all slots in the account storage before executing the calls

### stateDiff?

> `readonly` `optional` **stateDiff**: `Record`\<[`Hex`](../../index/type-aliases/Hex.md), [`Hex`](../../index/type-aliases/Hex.md)\>

key-value mapping to override individual slots in the account storage before executing the calls

### storageRoot?

> `readonly` `optional` **storageRoot**: [`Hex`](../../index/type-aliases/Hex.md)

Storage root to set account to

## Type Parameters

### TThrowOnFail

`TThrowOnFail` *extends* `boolean` = `boolean`

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
