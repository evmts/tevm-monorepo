[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateParams

# Type Alias: DebugTraceStateParams\<TStateFilters\>

> **DebugTraceStateParams**\<`TStateFilters`\>: `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L145)

Params taken by `debug_traceState` handler

## Type Parameters

• **TStateFilters** *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] = readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[]

## Type declaration

### filters?

> `readonly` `optional` **filters**: `TStateFilters`

Filters to apply to the state

### timeout?

> `readonly` `optional` **timeout**: `string`

Timeout for the state trace
