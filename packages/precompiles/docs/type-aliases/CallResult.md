[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / CallResult

# Type Alias: CallResult\<TAbi, TFunctionName\>

> **CallResult**\<`TAbi`, `TFunctionName`\> = `object`

Defined in: [CallResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L25)

A result of a precompile javascript call

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TFunctionName

`TFunctionName` *extends* `string`

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [CallResult.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L54)

Amount of blob gas consumed by the transaction

***

### error?

> `optional` **error**: [`TypedError`](TypedError.md)\<`string`\>

Defined in: [CallResult.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L37)

Any Error thrown during execution

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [CallResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L29)

The amount of gas used during execution.

***

### logs?

> `optional` **logs**: `ReadonlyArray`\<\{ `address`: `Address`; `args`: `EncodeEventTopicsParameters`\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"args"`\]; `eventName`: `EncodeEventTopicsParameters`\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"eventName"`\]; \}\>

Defined in: [CallResult.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L42)

Logs emitted during contract execution.
Logs must match the interface of the ABI

***

### returnValue

> **returnValue**: `AbiParametersToPrimitiveTypes`\<`ExtractAbiFunction`\<`TAbi`, `TFunctionName`\>\[`"outputs"`\]\>\[`0`\]

Defined in: [CallResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L33)

The return value of the call. Required even on exceptions

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`Address`\>

Defined in: [CallResult.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L50)

A set of accounts to selfdestruct
