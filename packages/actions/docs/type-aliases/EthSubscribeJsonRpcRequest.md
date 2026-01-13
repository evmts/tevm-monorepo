[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSubscribeJsonRpcRequest

# Type Alias: EthSubscribeJsonRpcRequest

> **EthSubscribeJsonRpcRequest** = `JsonRpcRequest`\<`"eth_subscribe"`, readonly \[`"newHeads"` \| `"logs"` \| `"newPendingTransactions"` \| `"syncing"`, `SerializeToJson`\<\{ `address?`: `Address` \| `Address`[]; `topics?`: (`Hex` \| `Hex`[] \| `null`)[]; \}\>\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:330](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L330)

JSON-RPC request for `eth_subscribe` procedure
