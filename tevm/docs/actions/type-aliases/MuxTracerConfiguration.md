[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MuxTracerConfiguration

# Type Alias: MuxTracerConfiguration\<TDiffMode\>

> **MuxTracerConfiguration**\<`TDiffMode`\> = `object`

Configuration for muxTracer
Each key is a tracer name and the value is that tracer's specific config

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Type |
| ------ | ------ |
| <a id="4bytetracer"></a> `4byteTracer?` | `Record`\<`string`, `never`\> \| \{ \} |
| <a id="calltracer"></a> `callTracer?` | `Record`\<`string`, `never`\> \| \{ \} |
| <a id="default"></a> `default?` | `Record`\<`string`, `never`\> \| \{ \} |
| <a id="flatcalltracer"></a> `flatCallTracer?` | `Record`\<`string`, `never`\> \| \{ \} |
| <a id="prestatetracer"></a> `prestateTracer?` | `object` |
| `prestateTracer.diffMode?` | `TDiffMode` |
