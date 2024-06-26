[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [procedures](../README.md) / CallJsonRpcRequest

# Type Alias: CallJsonRpcRequest

> **CallJsonRpcRequest**: [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"tevm_call"`, [[`SerializeToJson`](SerializeToJson.md)\<`Omit`\<[`CallParams`](../../index/type-aliases/CallParams.md), `"stateOverrideSet"` \| `"blockOverrideSet"`\>\>, [`SerializeToJson`](SerializeToJson.md)\<[`CallParams`](../../index/type-aliases/CallParams.md)\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<[`CallParams`](../../index/type-aliases/CallParams.md)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `tevm_call`

## Defined in

packages/procedures/dist/index.d.ts:33
