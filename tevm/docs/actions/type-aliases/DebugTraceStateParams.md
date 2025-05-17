[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceStateParams

# Type Alias: DebugTraceStateParams\<TStateFilters\>

> **DebugTraceStateParams**\<`TStateFilters`\> = `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:87

Params taken by `debug_traceState` handler

## Type Parameters

### TStateFilters

`TStateFilters` *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] = readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[]

## Properties

### filters?

> `readonly` `optional` **filters**: `TStateFilters`

Defined in: packages/actions/types/debug/DebugParams.d.ts:91

Filters to apply to the state

***

### timeout?

> `readonly` `optional` **timeout**: `string`

Defined in: packages/actions/types/debug/DebugParams.d.ts:95

Timeout for the state trace
