[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / TracerResultMap

# Type Alias: TracerResultMap\<TDiffMode\>

> **TracerResultMap**\<`TDiffMode`\> = `object`

Maps tracer type to its result type

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Type |
| ------ | ------ |
| <a id="4bytetracer"></a> `4byteTracer` | [`FourbyteTraceResult`](FourbyteTraceResult.md) |
| <a id="calltracer"></a> `callTracer` | [`CallTraceResult`](CallTraceResult.md) |
| <a id="default"></a> `default` | [`TraceResult`](../../index/type-aliases/TraceResult.md) |
| <a id="flatcalltracer"></a> `flatCallTracer` | [`FlatCallTraceResult`](FlatCallTraceResult.md) |
| <a id="prestatetracer"></a> `prestateTracer` | [`PrestateTraceResult`](../../index/type-aliases/PrestateTraceResult.md)\<`TDiffMode`\> |
