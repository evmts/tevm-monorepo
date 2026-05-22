[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceBlockJsonRpcProcedure

# Function: debugTraceBlockJsonRpcProcedure()

> **debugTraceBlockJsonRpcProcedure**(`client`): `DebugTraceBlockProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceBlockProcedure.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceBlockProcedure.js#L19)

Creates a JSON-RPC procedure handler for the `debug_traceBlock` method

This handler traces the execution of all transactions in a block, providing
detailed traces for each transaction. It handles both block hash and block number
identifiers and supports multiple tracer types.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

`DebugTraceBlockProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

## Throws

If the block cannot be found or its parent state cannot be forked.
