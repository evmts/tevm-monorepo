[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / NetworkSync

# Type Alias: NetworkSync

> **NetworkSync** = `object`

Defined in: [eip1193/NetworkSync.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L43)

Information about the Ethereum client's sync status.
Returned by the eth_syncing JSON-RPC method when synchronization is in progress.

## Example

```typescript
import { NetworkSync } from '@tevm/decorators'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from '@tevm/decorators'

const node = createTevmNode().extend(requestEip1193())
const syncStatus = await node.request({ method: 'eth_syncing' })

if (syncStatus !== false) {
  const networkSync: NetworkSync = syncStatus
  console.log(`Syncing: ${networkSync.currentBlock} of ${networkSync.highestBlock}`)
  console.log(`Progress: ${(parseInt(networkSync.currentBlock, 16) / parseInt(networkSync.highestBlock, 16) * 100).toFixed(2)}%`)
} else {
  console.log('Node is fully synced')
}
```

## Properties

### currentBlock

> **currentBlock**: [`Quantity`](Quantity.md)

Defined in: [eip1193/NetworkSync.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L45)

The current block number

***

### highestBlock

> **highestBlock**: [`Quantity`](Quantity.md)

Defined in: [eip1193/NetworkSync.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L47)

Number of latest block on the network

***

### startingBlock

> **startingBlock**: [`Quantity`](Quantity.md)

Defined in: [eip1193/NetworkSync.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L49)

Block number at which syncing started
