[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetCoinbaseJsonRpcRequest

# Type Alias: AnvilSetCoinbaseJsonRpcRequest

> **AnvilSetCoinbaseJsonRpcRequest** = `JsonRpcRequest`\<`"anvil_setCoinbase"`, readonly \[`Address`\]\>

Defined in: [packages/actions/src/anvil/AnvilJsonRpcRequest.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilJsonRpcRequest.ts#L65)

JSON-RPC request for `anvil_setCoinbase` method
Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
