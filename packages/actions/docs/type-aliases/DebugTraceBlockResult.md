[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceBlockResult

# Type Alias: DebugTraceBlockResult\<TTracer, TDiffMode\>

> **DebugTraceBlockResult**\<`TTracer`, `TDiffMode`\> = `object`[]

Defined in: [packages/actions/src/debug/DebugResult.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L55)

Result from `debug_traceBlock`.

Returns an array of transaction traces

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined`

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
