[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceTransactionJsonRpcProcedure

# Function: debugTraceTransactionJsonRpcProcedure()

> **debugTraceTransactionJsonRpcProcedure**(`client`): `DebugTraceTransactionProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceTransactionProcedure.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceTransactionProcedure.js#L20)

Creates a JSON-RPC procedure handler for the `debug_traceTransaction` method

This handler traces the execution of a historical transaction using the EVM's step-by-step
execution tracing capabilities. It reconstructs the state at the point of the transaction
by replaying all previous transactions in the block and then provides a detailed trace.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

`DebugTraceTransactionProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

## Throws

If the transaction cannot be found or its parent state cannot be forked.
