[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / traceCallHandler

# Function: traceCallHandler()

> **traceCallHandler**(`client`): `DebugTraceCallHandler`

Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

## Returns

`DebugTraceCallHandler`

an execution trace of an eth_call in the context of a given block execution
mirroring the output from traceTransaction

## Source

[packages/actions/src/debug/traceCallHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/traceCallHandler.js#L11)
