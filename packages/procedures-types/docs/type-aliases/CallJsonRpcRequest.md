**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CallJsonRpcRequest

# Type alias: CallJsonRpcRequest

> **CallJsonRpcRequest**: `JsonRpcRequest`\<`"tevm_call"`, [[`SerializeToJson`](SerializeToJson.md)\<`Omit`\<`CallParams`, `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, [`SerializeToJson`](SerializeToJson.md)\<`CallParams`[`"stateOverrideSet"`]\>, [`SerializeToJson`](SerializeToJson.md)\<`CallParams`[`"blockOverrideSet"`]\>]\>

JSON-RPC request for `tevm_call`

## Source

[requests/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/CallJsonRpcRequest.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
