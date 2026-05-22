[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetBlockReceiptsJsonRpcProcedure

# Function: ethGetBlockReceiptsJsonRpcProcedure()

> **ethGetBlockReceiptsJsonRpcProcedure**(`client`): [`EthGetBlockReceiptsJsonRpcProcedure`](../type-aliases/EthGetBlockReceiptsJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethGetBlockReceiptsProcedure.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetBlockReceiptsProcedure.js#L11)

Procedure for handling eth_getBlockReceipts JSON-RPC requests.
Accepts either a block hash, hex block number, or block tag.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`EthGetBlockReceiptsJsonRpcProcedure`](../type-aliases/EthGetBlockReceiptsJsonRpcProcedure.md)
