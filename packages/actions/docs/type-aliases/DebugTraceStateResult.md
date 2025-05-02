[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateResult

# Type Alias: DebugTraceStateResult\<TStateFilters\>

> **DebugTraceStateResult**\<`TStateFilters`\>: `TStateFilters`\[`"length"`\] *extends* `0` ? [`DebugTraceStateObject`](DebugTraceStateObject.md) : `UnionToIntersection`\<`{ [I in keyof TStateFilters]: GetPath<DebugTraceStateObject, TStateFilters[I] & string> }`\[keyof `TStateFilters`\]\>

Defined in: [packages/actions/src/debug/DebugResult.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L117)

Result from `debug_traceState`

## Type Parameters

• **TStateFilters** *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] = readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[]
