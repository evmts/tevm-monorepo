**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GetAccountResult

# Type alias: GetAccountResult`<ErrorType>`

> **GetAccountResult**\<`ErrorType`\>: `object`

Result of GetAccount Action

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`GetAccountError`](GetAccountError.md) |

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

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### nonce

> **nonce**?: `bigint`

Nonce to set account to

### storageRoot

> **storageRoot**?: `Hex`

Storage root to set account to

## Source

[result/GetAccountResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-types/src/result/GetAccountResult.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
