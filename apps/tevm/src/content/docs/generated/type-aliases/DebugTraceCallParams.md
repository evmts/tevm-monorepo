---
editUrl: false
next: false
prev: false
title: "DebugTraceCallParams"
---

> **DebugTraceCallParams**\<`TChain`\>: [`TraceParams`](/generated/type-aliases/traceparams/) & `object`

Params taken by `debug_traceCall` handler

## Type declaration

### block

> **block**?: `BlockTag` \| `Hex` \| `BigInt`

Block information

### transaction

> **transaction**: `CallParameters`\<`TChain`\>

The transaction to debug

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

vm/api/dist/index.d.ts:582

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
