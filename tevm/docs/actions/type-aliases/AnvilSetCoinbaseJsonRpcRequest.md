[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetCoinbaseJsonRpcRequest

# Type Alias: AnvilSetCoinbaseJsonRpcRequest

> **AnvilSetCoinbaseJsonRpcRequest** = [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"anvil_setCoinbase"`, readonly \[[`Address`](../../index/type-aliases/Address.md)\]\>

Defined in: packages/actions/types/anvil/AnvilJsonRpcRequest.d.ts:28

JSON-RPC request for `anvil_setCoinbase` method
Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
