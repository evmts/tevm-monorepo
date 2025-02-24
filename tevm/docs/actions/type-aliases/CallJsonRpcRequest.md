[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions](../README.md) / CallJsonRpcRequest

# Type Alias: CallJsonRpcRequest

> **CallJsonRpcRequest**: [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"tevm_call"`, [`SerializeToJson`\<`Omit`\<[`CallParams`](../../index/type-aliases/CallParams.md), `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, `SerializeToJson`\<[`CallParams`](../../index/type-aliases/CallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`CallParams`](../../index/type-aliases/CallParams.md)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `tevm_call`

## Defined in

packages/actions/types/Call/CallJsonRpcRequest.d.ts:7
