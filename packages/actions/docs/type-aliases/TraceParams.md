[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TraceParams

# Type Alias: TraceParams\<TTracer, TDiffMode\>

> **TraceParams**\<`TTracer`, `TDiffMode`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L9)

Config params for trace calls

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### timeout?

> `readonly` `optional` **timeout**: `string`

Defined in: [packages/actions/src/debug/DebugParams.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L22)

A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".

#### Example

```ts
"10s"
```

***

### tracer?

> `readonly` `optional` **tracer**: `TTracer`

Defined in: [packages/actions/src/debug/DebugParams.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L17)

The type of tracer
Supported tracers: callTracer, prestateTracer

***

### tracerConfig?

> `readonly` `optional` **tracerConfig**: `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L26)

object to specify configurations for the tracer

#### diffMode?

> `readonly` `optional` **diffMode**: `TTracer` *extends* `"prestateTracer"` ? `TDiffMode` : `never`

When using the prestateTracer, setting this to true will make the tracer return only the state difference between before and after execution.
Default is false which returns the full state of all touched accounts.
