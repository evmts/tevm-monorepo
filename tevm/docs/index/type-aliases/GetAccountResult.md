[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / GetAccountResult

# Type alias: GetAccountResult\<ErrorType\>

> **GetAccountResult**\<`ErrorType`\>: `object`

Result of GetAccount Action

## Type parameters

• **ErrorType** = [`TevmGetAccountError`](TevmGetAccountError.md)

## Type declaration

### address

> **address**: `Address`

Address of account

### balance

> **balance**: `bigint`

Balance to set account to

### codeHash

> **codeHash**: `Hex`

Code hash to set account to

### deployedBytecode

> **deployedBytecode**: `Hex`

Contract bytecode to set account to

### errors?

> `optional` **errors**: `ErrorType`[]

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

> `optional` **storage**: `object`

Contract storage for the account
only included if `returnStorage` is set to true in the request

#### Index signature

 \[`key`: `Hex`\]: `Hex`

### storageRoot

> **storageRoot**: `Hex`

Storage root to set account to

## Source

packages/actions/types/GetAccount/GetAccountResult.d.ts:6
