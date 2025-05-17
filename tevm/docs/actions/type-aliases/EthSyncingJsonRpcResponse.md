[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSyncingJsonRpcResponse

# Type Alias: EthSyncingJsonRpcResponse

> **EthSyncingJsonRpcResponse** = [`JsonRpcResponse`](../../index/type-aliases/JsonRpcResponse.md)\<`"eth_syncing"`, `boolean` \| \{ `currentBlock`: [`Hex`](../../index/type-aliases/Hex.md); `headedBytecodebytes?`: [`Hex`](../../index/type-aliases/Hex.md); `healedBytecodes?`: [`Hex`](../../index/type-aliases/Hex.md); `healedTrienodes?`: [`Hex`](../../index/type-aliases/Hex.md); `healingBytecode?`: [`Hex`](../../index/type-aliases/Hex.md); `healingTrienodes?`: [`Hex`](../../index/type-aliases/Hex.md); `highestBlock`: [`Hex`](../../index/type-aliases/Hex.md); `knownStates`: [`Hex`](../../index/type-aliases/Hex.md); `pulledStates`: [`Hex`](../../index/type-aliases/Hex.md); `startingBlock`: [`Hex`](../../index/type-aliases/Hex.md); `syncedBytecodeBytes?`: [`Hex`](../../index/type-aliases/Hex.md); `syncedBytecodes?`: [`Hex`](../../index/type-aliases/Hex.md); `syncedStorage?`: [`Hex`](../../index/type-aliases/Hex.md); `syncedStorageBytes?`: [`Hex`](../../index/type-aliases/Hex.md); \}, `string` \| `number`\>

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:144

JSON-RPC response for `eth_syncing` procedure
