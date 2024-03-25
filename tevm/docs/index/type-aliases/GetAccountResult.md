**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > GetAccountResult

# Type alias: GetAccountResult`<ErrorType>`

> **GetAccountResult**\<`ErrorType`\>: `object`

Result of GetAccount Action

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`GetAccountError`](../../errors/type-aliases/GetAccountError.md) |

## Type declaration

### address

> **address**: [`Address`](../../actions-types/type-aliases/Address.md)

Address of account

### balance

> **balance**: `bigint`

Balance to set account to

### codeHash

> **codeHash**: [`Hex`](../../actions-types/type-aliases/Hex.md)

Code hash to set account to

### deployedBytecode

> **deployedBytecode**: [`Hex`](../../actions-types/type-aliases/Hex.md)

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

### storageRoot

> **storageRoot**: [`Hex`](../../actions-types/type-aliases/Hex.md)

Storage root to set account to

## Source

packages/actions-types/types/result/GetAccountResult.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
