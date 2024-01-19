---
editUrl: false
next: false
prev: false
title: "ScriptJsonRpcResponse"
---

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](/generated/tevm/api/type-aliases/jsonrpcresponse/)\<`"tevm_script"`, `SerializeToJson`\<[`CallResult`](/generated/tevm/api/type-aliases/callresult/)\>, [`ScriptError`](/generated/tevm/api/type-aliases/scripterror/)[`"_tag"`]\>

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

[responses/ScriptJsonRpcResponse.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ScriptJsonRpcResponse.ts#L20)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
