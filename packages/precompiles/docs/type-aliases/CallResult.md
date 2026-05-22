[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / CallResult

# Type Alias: CallResult\<TAbi, TFunctionName\>

> **CallResult**\<`TAbi`, `TFunctionName`\> = `object`

Defined in: [CallResult.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L34)

A result of a precompile javascript call

## Type Parameters

| Type Parameter |
| ------ |
| `TAbi` *extends* `Abi` |
| `TFunctionName` *extends* `string` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction | [CallResult.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L63) |
| <a id="error"></a> `error?` | [`TypedError`](TypedError.md)\<`string`\> | Any Error thrown during execution | [CallResult.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L46) |
| <a id="executiongasused"></a> `executionGasUsed` | `bigint` | The amount of gas used during execution. | [CallResult.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L38) |
| <a id="logs"></a> `logs?` | `ReadonlyArray`\<\{ `address`: `Address`; `args`: `EncodeEventTopicsParameters`\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"args"`\]; `eventName`: `EncodeEventTopicsParameters`\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"eventName"`\]; \}\> | Logs emitted during contract execution. Logs must match the interface of the ABI | [CallResult.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L51) |
| <a id="returnvalue"></a> `returnValue` | `CallReturnValue`\<`TAbi`, `TFunctionName`\> | The return value of the call. Required even on exceptions | [CallResult.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L42) |
| <a id="selfdestruct"></a> `selfdestruct?` | `Set`\<`Address`\> | A set of accounts to selfdestruct | [CallResult.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L59) |
