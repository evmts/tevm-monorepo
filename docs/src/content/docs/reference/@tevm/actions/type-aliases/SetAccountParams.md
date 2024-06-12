---
editUrl: false
next: false
prev: false
title: "SetAccountParams"
---

> **SetAccountParams**\<`TThrowOnFail`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnFail`\> & `object`

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

> `readonly` **address**: [`Address`](/reference/tevm/utils/type-aliases/address/)

Address of account

### balance?

> `optional` `readonly` **balance**: `bigint`

Balance to set account to

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Contract bytecode to set account to

### nonce?

> `optional` `readonly` **nonce**: `bigint`

Nonce to set account to

### state?

> `optional` `readonly` **state**: `Record`\<[`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

key-value mapping to override all slots in the account storage before executing the calls

### stateDiff?

> `optional` `readonly` **stateDiff**: `Record`\<[`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

key-value mapping to override individual slots in the account storage before executing the calls

### storageRoot?

> `optional` `readonly` **storageRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Storage root to set account to

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/SetAccount/SetAccountParams.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/SetAccountParams.ts#L17)
