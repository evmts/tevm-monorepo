[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / GetAccountResult

# Type Alias: GetAccountResult\<ErrorType\>

> **GetAccountResult**\<`ErrorType`\> = `object`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:6

Result of GetAccount Action

## Type Parameters

### ErrorType

`ErrorType` = [`TevmGetAccountError`](TevmGetAccountError.md)

## Properties

### address

> **address**: [`Address`](Address.md)

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:14

Address of account

***

### balance

> **balance**: `bigint`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:22

Balance to set account to

***

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:34

Code hash to set account to

***

### deployedBytecode

> **deployedBytecode**: [`Hex`](Hex.md)

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:26

Contract bytecode to set account to

***

### errors?

> `optional` **errors**: `ErrorType`[]

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:10

Description of the exception, if any occurred

***

### isContract

> **isContract**: `boolean`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:38

True if account is a contract

***

### isEmpty

> **isEmpty**: `boolean`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:42

True if account is empty

***

### nonce

> **nonce**: `bigint`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:18

Nonce to set account to

***

### storage?

> `optional` **storage**: `object`

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:47

Contract storage for the account
only included if `returnStorage` is set to true in the request

#### Index Signature

\[`key`: `` `0x${string}` ``\]: `` `0x${string}` ``

***

### storageRoot

> **storageRoot**: [`Hex`](Hex.md)

Defined in: packages/actions/types/GetAccount/GetAccountResult.d.ts:30

Storage root to set account to
