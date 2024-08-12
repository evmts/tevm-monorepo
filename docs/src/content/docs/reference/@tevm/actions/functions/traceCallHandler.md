---
editUrl: false
next: false
prev: false
title: "traceCallHandler"
---

> **traceCallHandler**(`client`): [`DebugTraceCallHandler`](/reference/tevm/actions/type-aliases/debugtracecallhandler/)

Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

## Returns

[`DebugTraceCallHandler`](/reference/tevm/actions/type-aliases/debugtracecallhandler/)

an execution trace of an eth_call in the context of a given block execution
mirroring the output from traceTransaction

## Defined in

[packages/actions/src/debug/traceCallHandler.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/traceCallHandler.js#L12)
