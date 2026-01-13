[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSubscribeJsonRpcRequest

# Type Alias: EthSubscribeJsonRpcRequest

> **EthSubscribeJsonRpcRequest** = [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"eth_subscribe"`, readonly \[`"newHeads"` \| `"logs"` \| `"newPendingTransactions"` \| `"syncing"`, `SerializeToJson`\<\{ `address?`: [`Address`](../../index/type-aliases/Address.md) \| [`Address`](../../index/type-aliases/Address.md)[]; `topics?`: ([`Hex`](../../index/type-aliases/Hex.md) \| [`Hex`](../../index/type-aliases/Hex.md)[] \| `null`)[]; \}\>\]\>

Defined in: packages/actions/types/eth/EthJsonRpcRequest.d.ts:231

JSON-RPC request for `eth_subscribe` procedure
