[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / TraceParams

# Type Alias: TraceParams

> **TraceParams** = `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:7

Config params for trace calls

## Properties

### timeout?

> `readonly` `optional` **timeout**: `string`

Defined in: packages/actions/types/debug/DebugParams.d.ts:17

A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".

#### Example

```ts
"10s"
```

***

### tracer

> `readonly` **tracer**: `"callTracer"` \| `"prestateTracer"`

Defined in: packages/actions/types/debug/DebugParams.d.ts:12

The type of tracer
Currently only callTracer supported

***

### tracerConfig?

> `readonly` `optional` **tracerConfig**: `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:21

object to specify configurations for the tracer
