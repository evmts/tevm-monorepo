[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceChainJsonRpcProcedure

# Function: debugTraceChainJsonRpcProcedure()

> **debugTraceChainJsonRpcProcedure**(`client`): `DebugTraceChainProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceChainProcedure.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceChainProcedure.js#L19)

Creates a JSON-RPC procedure handler for the `debug_traceChain` method

This handler traces all transactions in a range of blocks, providing detailed
traces for each transaction. This can generate large amounts of data for
block ranges with many transactions, so use with caution.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

`DebugTraceChainProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

## Throws

If any block in the range cannot be found or its parent state cannot be forked.
