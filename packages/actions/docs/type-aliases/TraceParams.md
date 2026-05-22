[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TraceParams

# Type Alias: TraceParams\<TTracer, TDiffMode\>

> **TraceParams**\<`TTracer`, `TDiffMode`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L9)

Config params for trace calls

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="timeout"></a> `timeout?` | `readonly` | `string` | A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms". **Example** `"10s"` | [packages/actions/src/debug/DebugParams.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L28) |
| <a id="tracer"></a> `tracer?` | `readonly` | `TTracer` | The type of tracer Supported tracers: callTracer, prestateTracer, 4byteTracer, flatCallTracer, muxTracer | [packages/actions/src/debug/DebugParams.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L23) |
| <a id="tracerconfig"></a> `tracerConfig?` | `readonly` | `TTracer` *extends* `"muxTracer"` ? [`MuxTracerConfiguration`](MuxTracerConfiguration.md)\<`TDiffMode`\> : `object` | object to specify configurations for the tracer. For muxTracer, this specifies which tracers to run and their individual configs. | [packages/actions/src/debug/DebugParams.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L33) |
