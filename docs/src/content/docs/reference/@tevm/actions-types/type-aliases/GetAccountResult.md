---
editUrl: false
next: false
prev: false
title: "GetAccountResult"
---

> **GetAccountResult**\<`ErrorType`\>: `object`

Result of GetAccount Action

## Type parameters

• **ErrorType** = [`GetAccountError`](/reference/errors/type-aliases/getaccounterror/)

## Type declaration

### address

> **address**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

Address of account

### balance

> **balance**: `bigint`

Balance to set account to

### codeHash

> **codeHash**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Code hash to set account to

### deployedBytecode

> **deployedBytecode**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Contract bytecode to set account to

### errors?

> **`optional`** **errors**: `ErrorType`[]

Description of the exception, if any occurred

### isContract

> **isContract**: `boolean`

True if account is a contract

### isEmpty

> **isEmpty**: `boolean`

True if account is empty

### nonce

> **nonce**: `bigint`

Nonce to set account to

### storage?

> **`optional`** **storage**: `object`

Contract storage for the account
only included if `returnStorage` is set to true in the request

#### Index signature

 \[`key`: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)\]: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### storageRoot

> **storageRoot**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Storage root to set account to

## Source

[result/GetAccountResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/GetAccountResult.ts#L7)
