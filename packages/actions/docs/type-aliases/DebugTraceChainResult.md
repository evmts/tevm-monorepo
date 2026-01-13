[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceChainResult

# Type Alias: DebugTraceChainResult\<TTracer, TDiffMode\>

> **DebugTraceChainResult**\<`TTracer`, `TDiffMode`\> = `object`[]

Defined in: [packages/actions/src/debug/DebugResult.ts:266](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L266)

Result from `debug_traceChain`

Returns traces for all transactions in the specified block range

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Type Declaration

### blockHash

> **blockHash**: [`Hex`](Hex.md)

Block hash

### blockNumber

> **blockNumber**: `number`

Block number

### txTraces

> **txTraces**: `object`[]

Traces for all transactions in this block
