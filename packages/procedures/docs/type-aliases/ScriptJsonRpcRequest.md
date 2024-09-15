[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / ScriptJsonRpcRequest

# Type Alias: ~~ScriptJsonRpcRequest~~

> **ScriptJsonRpcRequest**: `JsonRpcRequest`\<`"tevm_script"`, [[`SerializeToJson`](SerializeToJson.md)\<`Omit`\<`BaseCallParams`, `"stateOverrideSet"` \| `"blockOverrideSet"`\>\> & `object`, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"blockOverrideSet"`\]\>]\>

## Deprecated

Use CallJsonRpcProcedure instead
The JSON-RPC request for the `tevm_script` method

## Defined in

[packages/procedures/src/script/ScriptJsonRpcRequest.ts:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/procedures/src/script/ScriptJsonRpcRequest.ts#L10)
