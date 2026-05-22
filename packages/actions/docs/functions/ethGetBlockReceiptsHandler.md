[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetBlockReceiptsHandler

# Function: ethGetBlockReceiptsHandler()

> **ethGetBlockReceiptsHandler**(`client`): [`EthGetBlockReceiptsHandler`](../type-aliases/EthGetBlockReceiptsHandler.md)

Defined in: [packages/actions/src/eth/ethGetBlockReceiptsHandler.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetBlockReceiptsHandler.js#L29)

Retrieves all transaction receipts for a given block by number, tag, or hash.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`EthGetBlockReceiptsHandler`](../type-aliases/EthGetBlockReceiptsHandler.md)

## Throws

If the block is not found or receipts cannot be processed.
