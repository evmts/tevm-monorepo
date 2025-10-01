[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockResult

# Type Alias: DebugTraceBlockResult\<TTracer, TDiffMode\>

> **DebugTraceBlockResult**\<`TTracer`, `TDiffMode`\> = `object`[]

Defined in: packages/actions/types/debug/DebugResult.d.ts:26

Result from `debug_traceBlock`.

Returns an array of transaction traces

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

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
