[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / TracerResultMap

# Type Alias: TracerResultMap\<TDiffMode\>

> **TracerResultMap**\<`TDiffMode`\> = `object`

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:13

Maps tracer type to its result type

## Type Parameters

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### 4byteTracer

> **4byteTracer**: [`FourbyteTraceResult`](FourbyteTraceResult.md)

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:16

***

### callTracer

> **callTracer**: [`CallTraceResult`](CallTraceResult.md)

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:14

***

### default

> **default**: [`TraceResult`](../../index/type-aliases/TraceResult.md)

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:18

***

### flatCallTracer

> **flatCallTracer**: [`FlatCallTraceResult`](FlatCallTraceResult.md)

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:17

***

### prestateTracer

> **prestateTracer**: [`PrestateTraceResult`](../../index/type-aliases/PrestateTraceResult.md)\<`TDiffMode`\>

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:15
