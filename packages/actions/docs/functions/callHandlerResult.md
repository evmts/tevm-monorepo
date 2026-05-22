[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / callHandlerResult

# Function: callHandlerResult()

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

Defined in: [packages/actions/src/Call/callHandlerResult.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerResult.js#L14)

**`Internal`**

Creates a CallHandler for handling call params with the Tevm EVM.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `evmResult` | `RunTxResult` & `EVMResult` | - |
| `txHash` | `` `0x${string}` `` \| `undefined` | - |
| `trace` | [`TraceResult`](../type-aliases/TraceResult.md) \| `undefined` | - |
| `accessList` | `Map`\<`string`, `Set`\<`string`\>\> \| `undefined` | returned by the evm |

## Returns

[`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

## Throws

any error means the input and output types were invalid or some invariant was broken
