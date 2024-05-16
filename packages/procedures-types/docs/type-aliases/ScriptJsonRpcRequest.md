[**@tevm/procedures-types**](../README.md) • **Docs**

***

[@tevm/procedures-types](../globals.md) / ScriptJsonRpcRequest

# Type alias: ScriptJsonRpcRequest

> **ScriptJsonRpcRequest**: `JsonRpcRequest`\<`"tevm_script"`, [[`SerializeToJson`](SerializeToJson.md)\<`Omit`\<`BaseCallParams`, `"stateOverrideSet"` \| `"blockOverrideSet"`\>\> & `object`, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"blockOverrideSet"`\]\>]\>

The JSON-RPC request for the `tevm_script` method

## Source

[requests/ScriptJsonRpcRequest.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/ScriptJsonRpcRequest.ts#L9)
