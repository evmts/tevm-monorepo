[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / PrestateTraceAnyResult

# Type Alias: PrestateTraceAnyResult\<TDiffMode\>

> **PrestateTraceAnyResult**\<`TDiffMode`\>: `TDiffMode` *extends* `true` ? [`PrestateTraceDiffResult`](PrestateTraceDiffResult.md) : `TDiffMode` *extends* `false` ? [`PrestateTraceResult`](PrestateTraceResult.md) : [`PrestateTraceResult`](PrestateTraceResult.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L54)

Union type of possible prestate tracer results

## Type Parameters

• **TDiffMode** *extends* `boolean` = `boolean`
