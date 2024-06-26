[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / CallJsonRpcRequest

# Type Alias: CallJsonRpcRequest

> **CallJsonRpcRequest**: `JsonRpcRequest`\<`"tevm_call"`, [[`SerializeToJson`](SerializeToJson.md)\<`Omit`\<`CallParams`, `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, [`SerializeToJson`](SerializeToJson.md)\<`CallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`CallParams`\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `tevm_call`

## Defined in

[procedures/src/call/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/call/CallJsonRpcRequest.ts#L8)
