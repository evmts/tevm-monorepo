[**@tevm/procedures-types**](../README.md) • **Docs**

***

[@tevm/procedures-types](../globals.md) / ScriptJsonRpcResponse

# Type alias: ScriptJsonRpcResponse

> **ScriptJsonRpcResponse**: `JsonRpcResponse`\<`"tevm_script"`, [`SerializeToJson`](SerializeToJson.md)\<`CallResult`\>, `ScriptError`\[`"_tag"`\]\>

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
