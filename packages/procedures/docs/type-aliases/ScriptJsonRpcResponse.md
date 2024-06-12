[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / ScriptJsonRpcResponse

# Type alias: ScriptJsonRpcResponse

> **ScriptJsonRpcResponse**: `JsonRpcResponse`\<`"tevm_script"`, [`SerializeToJson`](SerializeToJson.md)\<`CallResult`\>, `TevmScriptError`\[`"code"`\]\>

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

[procedures/src/script/ScriptJsonRpcResponse.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/script/ScriptJsonRpcResponse.ts#L20)
