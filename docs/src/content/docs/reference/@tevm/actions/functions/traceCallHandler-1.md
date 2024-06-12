---
editUrl: false
next: false
prev: false
title: "traceCallHandler"
---

> **traceCallHandler**(`client`): [`DebugTraceCallHandler`](/reference/tevm/actions/type-aliases/debugtracecallhandler-1/)

Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

## Returns

[`DebugTraceCallHandler`](/reference/tevm/actions/type-aliases/debugtracecallhandler-1/)

an execution trace of an eth_call in the context of a given block execution
mirroring the output from traceTransaction

## Source

[packages/actions/src/debug/traceCallHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/traceCallHandler.js#L11)
