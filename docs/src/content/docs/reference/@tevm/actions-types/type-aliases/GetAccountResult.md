---
editUrl: false
next: false
prev: false
title: "GetAccountResult"
---

> **GetAccountResult**\<`ErrorType`\>: `object`

Result of GetAccount Action

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`GetAccountError`](/reference/tevm/errors/type-aliases/getaccounterror/) |

## Type declaration

### address

> **address**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

Address of account

### balance

> **balance**?: `bigint`

Balance to set account to

### codeHash

> **codeHash**?: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Code hash to set account to

### deployedBytecode

> **deployedBytecode**?: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Contract bytecode to set account to

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### isContract

> **isContract**?: `boolean`

True if account is a contract

### isEmpty

> **isEmpty**?: `boolean`

True if account is empty

### nonce

> **nonce**?: `bigint`

Nonce to set account to

### storageRoot

> **storageRoot**?: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Storage root to set account to

## Source

[result/GetAccountResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/GetAccountResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
