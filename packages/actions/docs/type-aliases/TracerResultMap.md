[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TracerResultMap

# Type Alias: TracerResultMap\<TDiffMode\>

> **TracerResultMap**\<`TDiffMode`\> = `object`

Defined in: [packages/actions/src/common/MuxTraceResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L15)

Maps tracer type to its result type

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="4bytetracer"></a> `4byteTracer` | [`FourbyteTraceResult`](FourbyteTraceResult.md) | [packages/actions/src/common/MuxTraceResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L18) |
| <a id="calltracer"></a> `callTracer` | [`CallTraceResult`](CallTraceResult.md) | [packages/actions/src/common/MuxTraceResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L16) |
| <a id="default"></a> `default` | [`TraceResult`](TraceResult.md) | [packages/actions/src/common/MuxTraceResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L20) |
| <a id="flatcalltracer"></a> `flatCallTracer` | [`FlatCallTraceResult`](FlatCallTraceResult.md) | [packages/actions/src/common/MuxTraceResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L19) |
| <a id="prestatetracer"></a> `prestateTracer` | [`PrestateTraceResult`](PrestateTraceResult.md)\<`TDiffMode`\> | [packages/actions/src/common/MuxTraceResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L17) |
