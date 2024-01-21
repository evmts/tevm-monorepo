**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > LoadStateJsonRpcProcedure

# Type alias: LoadStateJsonRpcProcedure

> **LoadStateJsonRpcProcedure**: (`request`) => `Promise`\<[`LoadStateJsonRpcResponse`](LoadStateJsonRpcResponse.md)\>

Procedure for handling script JSON-RPC requests
Procedure for handling tevm_loadState JSON-RPC requests

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

## Parameters

▪ **request**: [`LoadStateJsonRpcRequest`](LoadStateJsonRpcRequest.md)

## Source

[procedure/LoadStateJsonRpcProcedure.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/LoadStateJsonRpcProcedure.ts#L17)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
