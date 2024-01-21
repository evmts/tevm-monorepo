**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DumpStateJsonRpcProcedure

# Type alias: DumpStateJsonRpcProcedure

> **DumpStateJsonRpcProcedure**: (`request`) => `Promise`\<`DumpStateJsonRpcResponse`\>

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

▪ **request**: [`DumpStateJsonRpcRequest`](DumpStateJsonRpcRequest.md)

## Source

[procedure/DumpStateJsonRpcProcedure.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/procedure/DumpStateJsonRpcProcedure.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
