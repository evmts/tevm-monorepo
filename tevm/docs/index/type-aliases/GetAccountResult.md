[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / GetAccountResult

# Type Alias: GetAccountResult\<ErrorType\>

> **GetAccountResult**\<`ErrorType`\>: `object`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:6

Result of GetAccount Action

## Type Parameters

• **ErrorType** = [`TevmGetAccountError`](TevmGetAccountError.md)

## Type declaration

### address

> **address**: [`Address`](../../actions/type-aliases/Address.md)

Address of account

### balance

> **balance**: `bigint`

Balance to set account to

### codeHash

> **codeHash**: [`Hex`](../../actions/type-aliases/Hex.md)

Code hash to set account to

### deployedBytecode

> **deployedBytecode**: [`Hex`](../../actions/type-aliases/Hex.md)

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

#### Index Signature

\[`key`: `` `0x${string}` ``\]: `` `0x${string}` ``

### storageRoot

> **storageRoot**: [`Hex`](../../actions/type-aliases/Hex.md)

Storage root to set account to
