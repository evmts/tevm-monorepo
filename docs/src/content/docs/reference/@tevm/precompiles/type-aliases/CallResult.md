---
editUrl: false
next: false
prev: false
title: "CallResult"
---

> **CallResult**\<`TAbi`, `TFunctionName`\>: `object`

A result of a precompile javascript call

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TFunctionName** *extends* `string`

## Type declaration

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

### error?

> `optional` **error**: [`TypedError`](/reference/tevm/precompiles/type-aliases/typederror/)\<`string`\>

Any Error thrown during execution

### executionGasUsed

> **executionGasUsed**: `bigint`

The amount of gas used during execution.

### logs?

> `optional` **logs**: `ReadonlyArray`\<`object`\>

Logs emitted during contract execution.
Logs must match the interface of the ABI

#### Type declaration

##### address

> **address**: [`Address`](/reference/tevm/utils/type-aliases/address/)

##### args

> **args**: [`EncodeEventTopicsParameters`](/reference/tevm/utils/type-aliases/encodeeventtopicsparameters/)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"args"`\]

##### eventName

> **eventName**: [`EncodeEventTopicsParameters`](/reference/tevm/utils/type-aliases/encodeeventtopicsparameters/)\<`TAbi`, `ContractEventName`\<`TAbi`\>\>\[`"eventName"`\]

### returnValue

> **returnValue**: [`AbiParametersToPrimitiveTypes`](/reference/tevm/utils/type-aliases/abiparameterstoprimitivetypes/)\<[`ExtractAbiFunction`](/reference/tevm/utils/type-aliases/extractabifunction/)\<`TAbi`, `TFunctionName`\>\[`"outputs"`\]\>\[`0`\]

The return value of the call. Required even on exceptions

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<[`Address`](/reference/tevm/utils/type-aliases/address/)\>

A set of accounts to selfdestruct

## Defined in

[CallResult.ts:25](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/precompiles/src/CallResult.ts#L25)
