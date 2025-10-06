[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / createTestSnapshotNode

# Function: createTestSnapshotNode()

> **createTestSnapshotNode**(`options`): [`TestSnapshotNode`](../type-aliases/TestSnapshotNode.md)

Defined in: [extensions/test-node/src/createTestSnapshotNode.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/createTestSnapshotNode.ts#L33)

Creates a test snapshot node that automatically caches RPC responses

## Parameters

### options

[`TestSnapshotNodeOptions`](../type-aliases/TestSnapshotNodeOptions.md)

Configuration options for the node

## Returns

[`TestSnapshotNode`](../type-aliases/TestSnapshotNode.md)

A test snapshot node with automatic caching

## Example

```typescript
import { createTestSnapshotNode } from '@tevm/test-node'
import { blockNumberProcedure } from '@tevm/actions'
import { http } from 'viem'

const node = createTestSnapshotNode({
  fork: { transport: http('https://mainnet.optimism.io')() },
  test: { cacheDir: '.tevm/test-snapshots' }
})

// Use the node in your tests
await node.server.start()
const block = await blockNumberProcedure(node)({
  jsonrpc: '2.0',
  method: 'eth_blockNumber',
  id: 1,
  params: [],
})
await node.server.stop()
```
