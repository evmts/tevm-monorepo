[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSyncingJsonRpcResponse

# Type Alias: EthSyncingJsonRpcResponse

> **EthSyncingJsonRpcResponse** = `JsonRpcResponse`\<`"eth_syncing"`, `boolean` \| \{ `currentBlock`: `Hex`; `headedBytecodebytes?`: `Hex`; `healedBytecodes?`: `Hex`; `healedTrienodes?`: `Hex`; `healingBytecode?`: `Hex`; `healingTrienodes?`: `Hex`; `highestBlock`: `Hex`; `knownStates`: `Hex`; `pulledStates`: `Hex`; `startingBlock`: `Hex`; `syncedBytecodeBytes?`: `Hex`; `syncedBytecodes?`: `Hex`; `syncedStorage?`: `Hex`; `syncedStorageBytes?`: `Hex`; \}, `string` \| `number`\>

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L321)

JSON-RPC response for `eth_syncing` procedure
