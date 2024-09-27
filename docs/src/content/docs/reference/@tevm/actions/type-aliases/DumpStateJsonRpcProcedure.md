---
editUrl: false
next: false
prev: false
title: "DumpStateJsonRpcProcedure"
---

> **DumpStateJsonRpcProcedure**: (`request`) => `Promise`\<[`DumpStateJsonRpcResponse`](/reference/tevm/actions/type-aliases/dumpstatejsonrpcresponse/)\>

Procedure for handling tevm_dumpState JSON-RPC requests

## Parameters

• **request**: [`DumpStateJsonRpcRequest`](/reference/tevm/actions/type-aliases/dumpstatejsonrpcrequest/)

## Returns

`Promise`\<[`DumpStateJsonRpcResponse`](/reference/tevm/actions/type-aliases/dumpstatejsonrpcresponse/)\>

the state as a JSON-RPC successful result

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

## Defined in

[packages/actions/src/DumpState/DumpStateJsonRpcProcedure.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateJsonRpcProcedure.ts#L16)
