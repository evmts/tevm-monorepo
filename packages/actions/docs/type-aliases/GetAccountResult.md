[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / GetAccountResult

# Type Alias: GetAccountResult\<ErrorType\>

> **GetAccountResult**\<`ErrorType`\> = `object`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L7)

Result of GetAccount Action

## Type Parameters

### ErrorType

`ErrorType` = [`TevmGetAccountError`](TevmGetAccountError.md)

## Properties

### address

> **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L15)

Address of account

***

### balance

> **balance**: `bigint`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L23)

Balance to set account to

***

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L35)

Code hash to set account to

***

### deployedBytecode

> **deployedBytecode**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L27)

Contract bytecode to set account to

***

### errors?

> `optional` **errors**: `ErrorType`[]

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L11)

Description of the exception, if any occurred

***

### isContract

> **isContract**: `boolean`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L39)

True if account is a contract

***

### isEmpty

> **isEmpty**: `boolean`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L43)

True if account is empty

***

### nonce

> **nonce**: `bigint`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L19)

Nonce to set account to

***

### storage?

> `optional` **storage**: `object`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L48)

Contract storage for the account
only included if `returnStorage` is set to true in the request

#### Index Signature

\[`key`: `` `0x${string}` ``\]: `` `0x${string}` ``

***

### storageRoot

> **storageRoot**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L31)

Storage root to set account to
