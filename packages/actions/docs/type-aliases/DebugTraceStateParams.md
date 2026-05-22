[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateParams

# Type Alias: DebugTraceStateParams\<TStateFilters\>

> **DebugTraceStateParams**\<`TStateFilters`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:210](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L210)

Params taken by `debug_traceState` handler

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStateFilters` *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] | readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] |

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="filters"></a> `filters?` | `readonly` | `TStateFilters` | Filters to apply to the state | [packages/actions/src/debug/DebugParams.ts:216](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L216) |
| <a id="timeout"></a> `timeout?` | `readonly` | `string` | Timeout for the state trace | [packages/actions/src/debug/DebugParams.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L220) |
