**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [procedures-types](../README.md) > DumpStateJsonRpcProcedure

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

▪ **request**: `DumpStateJsonRpcRequest`

## Source

packages/procedures-types/types/procedure/DumpStateJsonRpcProcedure.d.ts:15

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
