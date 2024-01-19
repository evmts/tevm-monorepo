---
editUrl: false
next: false
prev: false
title: "ScriptJsonRpcResponse"
---

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](/generated/type-aliases/jsonrpcresponse/)\<`"tevm_script"`, `SerializeToJson`\<[`CallResult`](/generated/type-aliases/callresult/)\>, [`ScriptError`](/generated/type-aliases/scripterror/)[`"_tag"`]\>

JSON-RPC response for `tevm_script` method

## Example

```ts
import { createTevm } from 'tevm'

const tevm = createTevm()

const respose: ScriptJsonRpcResponse = await tevm.request({
  method: 'tevm_script',
  params: {
    deployedBytecode: '608...',
    abi: [...],
    args: [...]
})
```

## Source

vm/api/dist/index.d.ts:1735

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
