[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MuxTracerConfig

# Type Alias: MuxTracerConfig\<TDiffMode\>

> **MuxTracerConfig**\<`TDiffMode`\> = \{ `tracer`: `"callTracer"`; \} \| \{ `config?`: \{ `diffMode?`: `TDiffMode`; \}; `tracer`: `"prestateTracer"`; \} \| \{ `tracer`: `"4byteTracer"`; \} \| \{ `tracer`: `"flatCallTracer"`; \} \| \{ `tracer`: `"default"`; \}

Defined in: [packages/actions/src/common/MuxTraceResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L26)

Configuration for a single tracer in muxTracer

## Type Parameters

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
