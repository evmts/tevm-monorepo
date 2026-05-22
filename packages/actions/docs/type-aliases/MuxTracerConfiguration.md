[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MuxTracerConfiguration

# Type Alias: MuxTracerConfiguration\<TDiffMode\>

> **MuxTracerConfiguration**\<`TDiffMode`\> = `object`

Defined in: [packages/actions/src/common/MuxTraceResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L77)

Configuration for muxTracer
Each key is a tracer name and the value is that tracer's specific config

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="4bytetracer"></a> `4byteTracer?` | `Record`\<`string`, `never`\> \| \{ \} | [packages/actions/src/common/MuxTraceResult.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L80) |
| <a id="calltracer"></a> `callTracer?` | `Record`\<`string`, `never`\> \| \{ \} | [packages/actions/src/common/MuxTraceResult.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L78) |
| <a id="default"></a> `default?` | `Record`\<`string`, `never`\> \| \{ \} | [packages/actions/src/common/MuxTraceResult.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L82) |
| <a id="flatcalltracer"></a> `flatCallTracer?` | `Record`\<`string`, `never`\> \| \{ \} | [packages/actions/src/common/MuxTraceResult.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L81) |
| <a id="prestatetracer"></a> `prestateTracer?` | `object` | [packages/actions/src/common/MuxTraceResult.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L79) |
| `prestateTracer.diffMode?` | `TDiffMode` | [packages/actions/src/common/MuxTraceResult.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L79) |
