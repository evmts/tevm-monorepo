[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MuxTracerConfig

# Type Alias: MuxTracerConfig\<TDiffMode\>

> **MuxTracerConfig**\<`TDiffMode`\> = \{ `tracer`: `"callTracer"`; \} \| \{ `config?`: \{ `diffMode?`: `TDiffMode`; \}; `tracer`: `"prestateTracer"`; \} \| \{ `tracer`: `"4byteTracer"`; \} \| \{ `tracer`: `"flatCallTracer"`; \} \| \{ `tracer`: `"default"`; \}

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:23

Configuration for a single tracer in muxTracer

## Type Parameters

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
