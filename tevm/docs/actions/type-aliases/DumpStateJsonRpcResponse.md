[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DumpStateJsonRpcResponse

# Type Alias: DumpStateJsonRpcResponse

> **DumpStateJsonRpcResponse** = [`JsonRpcResponse`](../../index/type-aliases/JsonRpcResponse.md)\<`"tevm_dumpState"`, `SerializeToJson`\<\{ `state`: [`ParameterizedTevmState`](../../state/type-aliases/ParameterizedTevmState.md); \}\>, [`TevmDumpStateError`](TevmDumpStateError.md)\[`"code"`\]\>

Defined in: packages/actions/types/DumpState/DumpStateJsonRpcResponse.d.ts:8

The response to the `tevm_dumpState` JSON-RPC request.
