[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateParams

# Type Alias: DebugTraceStateParams\<TStateFilters\>

> **DebugTraceStateParams**\<`TStateFilters`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:210](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L210)

Params taken by `debug_traceState` handler

## Type Parameters

### TStateFilters

`TStateFilters` *extends* readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[] = readonly [`DebugTraceStateFilter`](DebugTraceStateFilter.md)[]

## Properties

### filters?

> `readonly` `optional` **filters**: `TStateFilters`

Defined in: [packages/actions/src/debug/DebugParams.ts:216](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L216)

Filters to apply to the state

***

### timeout?

> `readonly` `optional` **timeout**: `string`

Defined in: [packages/actions/src/debug/DebugParams.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L220)

Timeout for the state trace
