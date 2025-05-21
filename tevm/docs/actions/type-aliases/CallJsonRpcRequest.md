[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallJsonRpcRequest

# Type Alias: CallJsonRpcRequest

> **CallJsonRpcRequest** = [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"tevm_call"`, \[`SerializeToJson`\<`Omit`\<[`CallParams`](CallParams.md), `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, `SerializeToJson`\<[`CallParams`](CallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`CallParams`](CallParams.md)\[`"blockOverrideSet"`\]\>\]\>

Defined in: packages/actions/types/Call/CallJsonRpcRequest.d.ts:7

JSON-RPC request for `tevm_call`
