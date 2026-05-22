[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / CallResult

# Type Alias: CallResult\<TAbi, TFunctionName\>

> **CallResult**\<`TAbi`, `TFunctionName`\> = `object`

A result of a precompile javascript call

## Type Parameters

| Type Parameter |
| ------ |
| `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) |
| `TFunctionName` *extends* `string` |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| <a id="error"></a> `error?` | [`TypedError`](TypedError.md)\<`string`\> | Any Error thrown during execution |
| <a id="executiongasused"></a> `executionGasUsed` | `bigint` | The amount of gas used during execution. |
| <a id="logs"></a> `logs?` | `ReadonlyArray`\<\{ `address`: [`Address`](../../index/type-aliases/Address.md); `args`: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"args"`\]; `eventName`: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"eventName"`\]; \}\> | Logs emitted during contract execution. Logs must match the interface of the ABI |
| <a id="returnvalue"></a> `returnValue` | `CallReturnValue`\<`TAbi`, `TFunctionName`\> | The return value of the call. Required even on exceptions |
| <a id="selfdestruct"></a> `selfdestruct?` | `Set`\<[`Address`](../../index/type-aliases/Address.md)\> | A set of accounts to selfdestruct |
