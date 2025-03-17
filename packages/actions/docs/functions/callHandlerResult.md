[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / callHandlerResult

# Function: callHandlerResult()

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

Defined in: [packages/actions/src/Call/callHandlerResult.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerResult.js#L14)

Creates an CallHandler for handling call params with Ethereumjs EVM

## Parameters

### evmResult

`RunTxResult`

### txHash

`` `0x${string}` ``

### trace

[`DebugTraceCallResult`](../type-aliases/DebugTraceCallResult.md)

### accessList

`Map`\<`string`, `Set`\<`string`\>\>

returned by the evm

## Returns

[`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

## Throws

any error means the input and output types were invalid or some invariant was broken
