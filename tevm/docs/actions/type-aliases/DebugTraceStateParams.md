[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceStateParams

# Type Alias: DebugTraceStateParams\<TStateFilters\>

> **DebugTraceStateParams**\<`TStateFilters`\> = `object`

Params taken by `debug_traceState` handler

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStateFilters` *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] | readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] |

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="filters"></a> `filters?` | `readonly` | `TStateFilters` | Filters to apply to the state |
| <a id="timeout"></a> `timeout?` | `readonly` | `string` | Timeout for the state trace |
