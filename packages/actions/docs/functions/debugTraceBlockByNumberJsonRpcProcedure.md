[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceBlockByNumberJsonRpcProcedure

# Function: debugTraceBlockByNumberJsonRpcProcedure()

> **debugTraceBlockByNumberJsonRpcProcedure**(`client`): `DebugTraceBlockByNumberProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceBlockByNumberProcedure.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceBlockByNumberProcedure.js#L14)

Creates a JSON-RPC procedure handler for the `debug_traceBlockByNumber` method

This handler is a convenience wrapper around `debug_traceBlock` that accepts a block number
as the first parameter directly (not wrapped in an object). It traces the execution of all
transactions in the specified block.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

`DebugTraceBlockByNumberProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

## Throws

If the block cannot be found or its parent state cannot be forked.
