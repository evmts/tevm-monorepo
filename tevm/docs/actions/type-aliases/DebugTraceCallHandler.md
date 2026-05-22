[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceCallHandler

# Type Alias: DebugTraceCallHandler

> **DebugTraceCallHandler** = \<`TTracer`, `TDiffMode`\>(`params`) => `Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`DebugTraceCallParams`](DebugTraceCallParams.md)\<`TTracer`, `TDiffMode`\> |

## Returns

`Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>
