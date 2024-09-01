---
editUrl: false
next: false
prev: false
title: "ScriptJsonRpcResponse"
---

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](/reference/tevm/jsonrpc/type-aliases/jsonrpcresponse/)\<`"tevm_script"`, [`SerializeToJson`](/reference/tevm/procedures/type-aliases/serializetojson/)\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\>, [`TevmScriptError`](/reference/tevm/actions/type-aliases/tevmscripterror/)\[`"code"`\]\>

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

:::caution[Deprecated]
Use CallJsonRpcProcedure instead
JSON-RPC response for `tevm_script` method
:::

## Defined in

[packages/procedures/src/script/ScriptJsonRpcResponse.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/script/ScriptJsonRpcResponse.ts#L21)
