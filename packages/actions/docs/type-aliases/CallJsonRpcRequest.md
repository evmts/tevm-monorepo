[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallJsonRpcRequest

# Type Alias: CallJsonRpcRequest

> **CallJsonRpcRequest** = `JsonRpcRequest`\<`"tevm_call"`, \[`SerializeToJson`\<`Omit`\<[`CallParams`](CallParams.md), `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, `SerializeToJson`\<[`CallParams`](CallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`CallParams`](CallParams.md)\[`"blockOverrideSet"`\]\>\]\>

Defined in: [packages/actions/src/Call/CallJsonRpcRequest.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallJsonRpcRequest.ts#L8)

JSON-RPC request for `tevm_call`
