---
editUrl: false
next: false
prev: false
title: "SetAccountParams"
---

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

> **address**: `Address`

Address of account

### balance

> **balance**?: `bigint`

Balance to set account to

### deployedBytecode

> **deployedBytecode**?: `Hex`

Contract bytecode to set account to

### nonce

> **nonce**?: `bigint`

Nonce to set account to

### storageRoot

> **storageRoot**?: `Hex`

Storage root to set account to

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/SetAccountParams.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/SetAccountParams.ts#L17)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
