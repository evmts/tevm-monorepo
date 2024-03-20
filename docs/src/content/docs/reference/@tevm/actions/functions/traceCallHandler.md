---
editUrl: false
next: false
prev: false
title: "traceCallHandler"
---

> **traceCallHandler**(`client`): [`DebugTraceCallHandler`](/reference/tevm/actions-types/type-aliases/debugtracecallhandler/)

Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block

## Parameters

▪ **client**: `Pick`\<`object`, `"getVm"`\>

## Returns

an execution trace of an eth_call in the context of a given block execution
mirroring the output from traceTransaction

## Source

[packages/actions/src/debug/traceCallHandler.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/traceCallHandler.js#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
