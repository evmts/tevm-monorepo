---
editUrl: false
next: false
prev: false
title: "DumpStateJsonRpcProcedure"
---

> **DumpStateJsonRpcProcedure**: (`request`) => `Promise`\<[`DumpStateJsonRpcResponse`](/reference/tevm/procedures-types/type-aliases/dumpstatejsonrpcresponse/)\>

Procedure for handling tevm_dumpState JSON-RPC requests

## Example

```ts
const result = await tevm.request({
.   method: 'tevm_DumpState',
   params: [],
.   id: 1,
  jsonrpc: '2.0'
. }
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_dumpState', result: {'0x...': '0x....', ...}}
```

## Parameters

▪ **request**: [`DumpStateJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/dumpstatejsonrpcrequest/)

## Source

[procedure/DumpStateJsonRpcProcedure.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/procedure/DumpStateJsonRpcProcedure.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
