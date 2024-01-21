**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ScriptJsonRpcResponse

# Type alias: ScriptJsonRpcResponse

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](JsonRpcResponse.md)\<`"tevm_script"`, `SerializeToJson`\<[`CallResult`](CallResult.md)\>, [`ScriptError`](ScriptError.md)[`"_tag"`]\>

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

[responses/ScriptJsonRpcResponse.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ScriptJsonRpcResponse.ts#L20)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
