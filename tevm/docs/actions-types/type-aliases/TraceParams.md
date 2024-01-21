**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > TraceParams

# Type alias: TraceParams

> **TraceParams**: `object`

Config params for trace calls

## Type declaration

### timeout

> **`readonly`** **timeout**?: `string`

A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".

#### Example

```ts
"10s"
```

### tracer

> **`readonly`** **tracer**: `"callTracer"` \| `"prestateTracer"`

The type of tracer
Currently only callTracer supported

### tracerConfig

> **`readonly`** **tracerConfig**?: `object`

object to specify configurations for the tracer

## Source

packages/actions-types/types/params/DebugParams.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
