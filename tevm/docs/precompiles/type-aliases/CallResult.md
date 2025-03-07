[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / CallResult

# Type Alias: CallResult\<TAbi, TFunctionName\>

> **CallResult**\<`TAbi`, `TFunctionName`\>: `object`

Defined in: packages/precompiles/dist/index.d.ts:29

A result of a precompile javascript call

## Type Parameters

• **TAbi** *extends* [`Abi`](../../index/type-aliases/Abi.md)

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

> `optional` **logs**: `ReadonlyArray`\<\{ `address`: [`Address`](../../index/type-aliases/Address.md); `args`: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"args"`\]; `eventName`: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"eventName"`\]; \}\>

Logs emitted during contract execution.
Logs must match the interface of the ABI

### returnValue

> **returnValue**: [`AbiParametersToPrimitiveTypes`](../../index/type-aliases/AbiParametersToPrimitiveTypes.md)\<[`ExtractAbiFunction`](../../index/type-aliases/ExtractAbiFunction.md)\<`TAbi`, `TFunctionName`\>\[`"outputs"`\]\>\[`0`\]

The return value of the call. Required even on exceptions

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<[`Address`](../../index/type-aliases/Address.md)\>

A set of accounts to selfdestruct
