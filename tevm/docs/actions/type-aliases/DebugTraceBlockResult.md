[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockResult

# Type Alias: DebugTraceBlockResult\<TTracer, TDiffMode\>

> **DebugTraceBlockResult**\<`TTracer`, `TDiffMode`\> = `object`[]

Result from `debug_traceBlock`.

Returns an array of transaction traces

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Type Declaration

### result

> **result**: [`DebugTraceTransactionResult`](DebugTraceTransactionResult.md)\<`TTracer`, `TDiffMode`\>

Trace result for this transaction

### txHash

> **txHash**: [`Hex`](Hex.md)

Transaction hash

### txIndex

> **txIndex**: `number`

Transaction index in the block
