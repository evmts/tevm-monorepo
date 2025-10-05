[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateParams

# Type Alias: DebugTraceStateParams\<TStateFilters\>

> **DebugTraceStateParams**\<`TStateFilters`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L161)

Params taken by `debug_traceState` handler

## Type Parameters

### TStateFilters

`TStateFilters` *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] = readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[]

## Properties

### filters?

> `readonly` `optional` **filters**: `TStateFilters`

Defined in: [packages/actions/src/debug/DebugParams.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L167)

Filters to apply to the state

***

### timeout?

> `readonly` `optional` **timeout**: `string`

Defined in: [packages/actions/src/debug/DebugParams.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L171)

Timeout for the state trace
