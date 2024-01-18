---
editUrl: false
next: false
prev: false
title: "AccountParams"
---

> **AccountParams**: `object`

Tevm params to put an account into the vm state

## Example

```ts
// all fields are optional except address
const accountParams: import('@tevm/api').AccountParams = {
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

## Source

[params/AccountParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AccountParams.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
