[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / CallResult

# Type Alias: CallResult\<TAbi, TFunctionName\>

> **CallResult**\<`TAbi`, `TFunctionName`\> = `object`

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:37

A result of a precompile javascript call

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md)

### TFunctionName

`TFunctionName` *extends* `string`

## Properties

### blobGasUsed?

> `optional` **blobGasUsed?**: `bigint`

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:66

Amount of blob gas consumed by the transaction

***

### error?

> `optional` **error?**: [`TypedError`](TypedError.md)\<`string`\>

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:49

Any Error thrown during execution

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:41

The amount of gas used during execution.

***

### logs?

> `optional` **logs?**: `ReadonlyArray`\<\{ `address`: [`Address`](../../index/type-aliases/Address.md); `args`: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"args"`\]; `eventName`: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"eventName"`\]; \}\>

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:54

Logs emitted during contract execution.
Logs must match the interface of the ABI

***

### returnValue

> **returnValue**: [`AbiParametersToPrimitiveTypes`](../../index/type-aliases/AbiParametersToPrimitiveTypes.md)\<[`ExtractAbiFunction`](../../index/type-aliases/ExtractAbiFunction.md)\<`TAbi`, `TFunctionName`\>\[`"outputs"`\]\>\[`0`\]

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:45

The return value of the call. Required even on exceptions

***

### selfdestruct?

> `optional` **selfdestruct?**: `Set`\<[`Address`](../../index/type-aliases/Address.md)\>

Defined in: tevm-monorepo/packages/precompiles/dist/index.d.ts:62

A set of accounts to selfdestruct
