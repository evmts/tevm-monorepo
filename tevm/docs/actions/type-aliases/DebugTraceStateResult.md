[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceStateResult

# Type Alias: DebugTraceStateResult\<TStateFilters\>

> **DebugTraceStateResult**\<`TStateFilters`\>: `TStateFilters`\[`"length"`\] *extends* `0` ? [`DebugTraceStateObject`](DebugTraceStateObject.md) : `UnionToIntersection`\<`{ [I in keyof TStateFilters]: GetPath<DebugTraceStateObject, TStateFilters[I] & string> }`\[keyof `TStateFilters`\]\>

Defined in: packages/actions/types/debug/DebugResult.d.ts:137

Result from `debug_traceState`

## Type Parameters

• **TStateFilters** *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] = readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[]
