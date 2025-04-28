[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / traceCallHandler

# Function: traceCallHandler()

> **traceCallHandler**(`client`): [`DebugTraceCallHandler`](../type-aliases/DebugTraceCallHandler.md)

Defined in: [packages/actions/src/debug/traceCallHandler.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/traceCallHandler.js#L13)

Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

## Returns

[`DebugTraceCallHandler`](../type-aliases/DebugTraceCallHandler.md)

an execution trace of an eth\_call in the context of a given block execution
mirroring the output from traceTransaction
