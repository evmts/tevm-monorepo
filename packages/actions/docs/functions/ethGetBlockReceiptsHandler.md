[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetBlockReceiptsHandler

# Function: ethGetBlockReceiptsHandler()

> **ethGetBlockReceiptsHandler**(`client`): [`EthGetBlockReceiptsHandler`](../type-aliases/EthGetBlockReceiptsHandler.md)

Defined in: [packages/actions/src/eth/ethGetBlockReceiptsHandler.js:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetBlockReceiptsHandler.js#L49)

Retrieves all transaction receipts for a given block.

This handler provides efficient bulk retrieval of receipts for all transactions in a block.
It supports both block numbers and block hashes as identifiers.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The Tevm client instance

## Returns

[`EthGetBlockReceiptsHandler`](../type-aliases/EthGetBlockReceiptsHandler.md)

The handler function

## Throws

If the block is not found or if there's an error processing receipts

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethGetBlockReceiptsHandler } from '@tevm/actions'

const client = await createTevmNode()
const handler = ethGetBlockReceiptsHandler(client)

// Get receipts by block number
const receipts = await handler({ blockTag: 1000n })

// Get receipts by block hash
const receiptsByHash = await handler({
  blockHash: '0x1234567890abcdef...'
})
```
