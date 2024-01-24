---
editUrl: false
next: false
prev: false
title: "ScriptJsonRpcResponse"
---

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](/reference/tevm/jsonrpc/type-aliases/jsonrpcresponse/)\<`"tevm_script"`, [`SerializeToJson`](/reference/tevm/procedures-types/type-aliases/serializetojson/)\<[`CallResult`](/reference/tevm/actions-types/type-aliases/callresult/)\>, [`ScriptError`](/reference/tevm/errors/type-aliases/scripterror/)[`"_tag"`]\>

JSON-RPC response for `tevm_script` method

## Example

```ts
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()

const respose: ScriptJsonRpcResponse = await tevm.request({
  method: 'tevm_script',
  params: {
    deployedBytecode: '608...',
    abi: [...],
    args: [...]
})
```

## Source

[responses/ScriptJsonRpcResponse.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/responses/ScriptJsonRpcResponse.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
