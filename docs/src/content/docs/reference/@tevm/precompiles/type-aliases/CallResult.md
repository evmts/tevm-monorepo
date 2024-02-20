---
editUrl: false
next: false
prev: false
title: "CallResult"
---

> **CallResult**\<`TAbi`, `TFunctionName`\>: `object`

A result of a precompile javascript call

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) |
| `TFunctionName` extends `string` |

## Type declaration

### blobGasUsed

> **blobGasUsed**?: `bigint`

Amount of blob gas consumed by the transaction

### error

> **error**?: [`TypedError`](/reference/tevm/precompiles/type-aliases/typederror/)\<`string`\>

Any Error thrown during execution

### executionGasUsed

> **executionGasUsed**: `bigint`

The amount of gas used during execution.

### logs

> **logs**?: `ReadonlyArray`\<[`ExtractAbiEvents`](/reference/tevm/utils/type-aliases/extractabievents/)\<`TAbi`\> & `object`\>

Logs emitted during contract execution.
Logs must match the interface of the ABI

### returnValue

> **returnValue**: [`AbiParametersToPrimitiveTypes`](/reference/tevm/utils/type-aliases/abiparameterstoprimitivetypes/)\<[`ExtractAbiFunction`](/reference/tevm/utils/type-aliases/extractabifunction/)\<`TAbi`, `TFunctionName`\>[`"outputs"`]\>[`0`]

The return value of the call. Required even on exceptions

### selfdestruct

> **selfdestruct**?: `Set`\<[`Address`](/reference/tevm/utils/type-aliases/address/)\>

A set of accounts to selfdestruct

## Source

[precompiles/src/CallResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
