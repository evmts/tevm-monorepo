**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ScriptJsonRpcResponse

# Type alias: ScriptJsonRpcResponse

> **ScriptJsonRpcResponse**: `JsonRpcResponse`\<`"tevm_script"`, [`SerializeToJson`](SerializeToJson.md)\<`CallResult`\>, `ScriptError`[`"_tag"`]\>

JSON-RPC response for `tevm_script` method

## Example

```ts
import { createMemoryTevm } from 'tevm'

const tevm = createMemoryTevm()

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
