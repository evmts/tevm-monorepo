[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / DumpStateJsonRpcProcedure

# Type alias: DumpStateJsonRpcProcedure()

> **DumpStateJsonRpcProcedure**: (`request`) => `Promise`\<[`DumpStateJsonRpcResponse`](DumpStateJsonRpcResponse.md)\>

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

• **request**: [`DumpStateJsonRpcRequest`](DumpStateJsonRpcRequest.md)

## Returns

`Promise`\<[`DumpStateJsonRpcResponse`](DumpStateJsonRpcResponse.md)\>

## Source

[procedures/src/dumpstate/DumpStateJsonRpcProcedure.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/dumpstate/DumpStateJsonRpcProcedure.ts#L16)