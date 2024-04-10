**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GetAccountResult

# Type alias: GetAccountResult`<ErrorType>`

> **GetAccountResult**\<`ErrorType`\>: `object`

Result of GetAccount Action

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | `GetAccountError` |

## Type declaration

### address

> **address**: [`Address`](Address.md)

Address of account

### balance

> **balance**: `bigint`

Balance to set account to

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Code hash to set account to

### deployedBytecode

> **deployedBytecode**: [`Hex`](Hex.md)

Contract bytecode to set account to

### errors

> **errors**?: `ErrorType`[]

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

### storage

> **storage**?: `object`

Contract storage for the account
only included if `returnStorage` is set to true in the request

#### Index signature

 \[`key`: [`Hex`](Hex.md)\]: [`Hex`](Hex.md)

### storageRoot

> **storageRoot**: [`Hex`](Hex.md)

Storage root to set account to

## Source

[result/GetAccountResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/GetAccountResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
