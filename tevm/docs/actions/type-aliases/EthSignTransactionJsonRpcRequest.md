[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSignTransactionJsonRpcRequest

# Type Alias: EthSignTransactionJsonRpcRequest

> **EthSignTransactionJsonRpcRequest** = [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"eth_signTransaction"`, readonly \[\{ `accessList?`: readonly `object`[]; `authorizationList?`: readonly `unknown`[]; `blobVersionedHashes?`: readonly [`Hex`](../../index/type-aliases/Hex.md)[]; `chainId?`: [`Hex`](../../index/type-aliases/Hex.md); `data?`: [`Hex`](../../index/type-aliases/Hex.md); `from`: [`Address`](../../index/type-aliases/Address.md); `gas?`: [`Hex`](../../index/type-aliases/Hex.md); `gasPrice?`: [`Hex`](../../index/type-aliases/Hex.md); `maxFeePerBlobGas?`: [`Hex`](../../index/type-aliases/Hex.md); `maxFeePerGas?`: [`Hex`](../../index/type-aliases/Hex.md); `maxPriorityFeePerGas?`: [`Hex`](../../index/type-aliases/Hex.md); `nonce?`: [`Hex`](../../index/type-aliases/Hex.md); `to?`: [`Address`](../../index/type-aliases/Address.md); `type?`: [`Hex`](../../index/type-aliases/Hex.md); `value?`: [`Hex`](../../index/type-aliases/Hex.md); \}\]\>

JSON-RPC request for `eth_signTransaction` procedure
