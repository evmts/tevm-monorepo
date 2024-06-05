[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [procedures-types](../README.md) / ScriptJsonRpcResponse

# Type alias: ScriptJsonRpcResponse

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](../../index/type-aliases/JsonRpcResponse.md)\<`"tevm_script"`, [`SerializeToJson`](SerializeToJson.md)\<[`CallResult`](../../index/type-aliases/CallResult.md)\>, [`ScriptError`](../../errors/type-aliases/ScriptError.md)\[`"_tag"`\]\>

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

packages/procedures-types/dist/index.d.ts:665
