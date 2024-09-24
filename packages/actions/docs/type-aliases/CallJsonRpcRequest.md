[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / CallJsonRpcRequest

# Type Alias: CallJsonRpcRequest

> **CallJsonRpcRequest**: `JsonRpcRequest`\<`"tevm_call"`, [`SerializeToJson`\<`Omit`\<[`CallParams`](CallParams.md), `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, `SerializeToJson`\<[`CallParams`](CallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`CallParams`](CallParams.md)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `tevm_call`

## Defined in

[packages/actions/src/Call/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallJsonRpcRequest.ts#L8)