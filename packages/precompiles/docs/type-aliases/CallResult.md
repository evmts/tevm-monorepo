[**@tevm/precompiles**](../README.md) • **Docs**

***

[@tevm/precompiles](../globals.md) / CallResult

# Type alias: CallResult\<TAbi, TFunctionName\>

> **CallResult**\<`TAbi`, `TFunctionName`\>: `object`

A result of a precompile javascript call

## Type parameters

• **TAbi** *extends* `Abi`

• **TFunctionName** *extends* `string`

## Type declaration

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

### error?

> `optional` **error**: [`TypedError`](TypedError.md)\<`string`\>

Any Error thrown during execution

### executionGasUsed

> **executionGasUsed**: `bigint`

The amount of gas used during execution.

### logs?

> `optional` **logs**: `ReadonlyArray`\<`ExtractAbiEvents`\<`TAbi`\> & `object`\>

Logs emitted during contract execution.
Logs must match the interface of the ABI

### returnValue

> **returnValue**: `AbiParametersToPrimitiveTypes`\<`ExtractAbiFunction`\<`TAbi`, `TFunctionName`\>\[`"outputs"`\]\>\[`0`\]

The return value of the call. Required even on exceptions

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`Address`\>

A set of accounts to selfdestruct

## Source

[precompiles/src/CallResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L7)
