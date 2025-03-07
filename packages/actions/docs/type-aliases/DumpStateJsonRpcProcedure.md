[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DumpStateJsonRpcProcedure

# Type Alias: DumpStateJsonRpcProcedure()

> **DumpStateJsonRpcProcedure**: (`request`) => `Promise`\<[`DumpStateJsonRpcResponse`](DumpStateJsonRpcResponse.md)\>

Defined in: [packages/actions/src/DumpState/DumpStateJsonRpcProcedure.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateJsonRpcProcedure.ts#L16)

Procedure for handling tevm_dumpState JSON-RPC requests

## Parameters

### request

[`DumpStateJsonRpcRequest`](DumpStateJsonRpcRequest.md)

## Returns

`Promise`\<[`DumpStateJsonRpcResponse`](DumpStateJsonRpcResponse.md)\>

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
