**@tevm/procedures-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/procedures-types](../README.md) / CallJsonRpcRequest

# Type alias: CallJsonRpcRequest

> **CallJsonRpcRequest**: `JsonRpcRequest`\<`"tevm_call"`, [[`SerializeToJson`](SerializeToJson.md)\<`Omit`\<`CallParams`, `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, [`SerializeToJson`](SerializeToJson.md)\<`CallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`CallParams`\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `tevm_call`

## Source

[requests/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/CallJsonRpcRequest.ts#L8)
