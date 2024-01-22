**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [procedures-types](../README.md) > ScriptJsonRpcResponse

# Type alias: ScriptJsonRpcResponse

> **ScriptJsonRpcResponse**: [`JsonRpcResponse`](../../index/type-aliases/JsonRpcResponse.md)\<`"tevm_script"`, `SerializeToJson`\<[`CallResult`](../../index/type-aliases/CallResult.md)\>, [`ScriptError`](../../actions-types/type-aliases/ScriptError.md)[`"_tag"`]\>

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

packages/procedures-spec/types/responses/ScriptJsonRpcResponse.d.ts:19

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
