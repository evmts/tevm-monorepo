[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / TraceParams

# Type Alias: TraceParams\<TTracer, TDiffMode\>

> **TraceParams**\<`TTracer`, `TDiffMode`\> = `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:8

Config params for trace calls

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### timeout?

> `readonly` `optional` **timeout**: `string`

Defined in: packages/actions/types/debug/DebugParams.d.ts:18

A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".

#### Example

```ts
"10s"
```

***

### tracer?

> `readonly` `optional` **tracer**: `TTracer`

Defined in: packages/actions/types/debug/DebugParams.d.ts:13

The type of tracer
Supported tracers: callTracer, prestateTracer, 4byteTracer, flatCallTracer, muxTracer

***

### tracerConfig?

> `readonly` `optional` **tracerConfig**: `TTracer` *extends* `"muxTracer"` ? [`MuxTracerConfiguration`](MuxTracerConfiguration.md)\<`TDiffMode`\> : `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:23

object to specify configurations for the tracer.
For muxTracer, this specifies which tracers to run and their individual configs.
