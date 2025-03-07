[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / LoadStateJsonRpcProcedure

# Type Alias: LoadStateJsonRpcProcedure()

> **LoadStateJsonRpcProcedure**: (`request`) => `Promise`\<[`LoadStateJsonRpcResponse`](LoadStateJsonRpcResponse.md)\>

Procedure for handling script JSON-RPC requests
Procedure for handling tevm_loadState JSON-RPC requests

## Parameters

• **request**: [`LoadStateJsonRpcRequest`](LoadStateJsonRpcRequest.md)

## Returns

`Promise`\<[`LoadStateJsonRpcResponse`](LoadStateJsonRpcResponse.md)\>

jsonrpc error response if there are errors otherwise it returns a successful empty object result

## Example

```ts
const result = await tevm.request({
.   method: 'tevm_loadState',
   params: { '0x..': '0x...', ...},
.   id: 1,
  jsonrpc: '2.0'
. }
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_loadState', result: {}}
```

## Defined in

[packages/actions/src/LoadState/LoadStateJsonRpcProcedure.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateJsonRpcProcedure.ts#L17)
