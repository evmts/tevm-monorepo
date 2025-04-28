[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockResult

# Type Alias: DebugTraceBlockResult\<TTracer, TDiffMode\>

> **DebugTraceBlockResult**\<`TTracer`, `TDiffMode`\>: `object`[]

Defined in: packages/actions/types/debug/DebugResult.d.ts:72

Result from `debug_traceBlock`.

Returns an array of transaction traces

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`

## Type declaration

### result

> **result**: [`DebugTraceTransactionResult`](DebugTraceTransactionResult.md)\<`TTracer`, `TDiffMode`\>

Trace result for this transaction

### txHash

> **txHash**: [`Hex`](Hex.md)

Transaction hash

### txIndex

> **txIndex**: `number`

Transaction index in the block
