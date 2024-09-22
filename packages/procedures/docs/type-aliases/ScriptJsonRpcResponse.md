[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / ScriptJsonRpcResponse

# Type Alias: ~~ScriptJsonRpcResponse~~

> **ScriptJsonRpcResponse**: `JsonRpcResponse`\<`"tevm_script"`, [`SerializeToJson`](SerializeToJson.md)\<`CallResult`\>, `TevmScriptError`\[`"code"`\]\>

## Deprecated

Use CallJsonRpcProcedure instead
JSON-RPC response for `tevm_script` method

## Example

```ts
import { createMemoryClient } from 'tevm'

const tevm = createMemoryClient()

const respose: ScriptJsonRpcResponse = await tevm.request({
  method: 'tevm_script',
  params: {
    deployedBytecode: '608...',
    abi: [...],
    args: [...]
})
```

## Defined in

[packages/procedures/src/script/ScriptJsonRpcResponse.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/script/ScriptJsonRpcResponse.ts#L21)
