[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ManualMining

# Type Alias: ManualMining

> **ManualMining** = `object`

Defined in: packages/node/dist/index.d.ts:59

Mining configuration where blocks are only created when explicitly requested.
Transactions remain in the mempool until manually mined.

## Example

```typescript
import { ManualMining } from '@tevm/node'

const value: ManualMining = {
  type: 'manual'
}

// Later blocks can be mined manually:
// await client.mine({ blocks: 1 })
```

## Properties

### type

> **type**: `"manual"`

Defined in: packages/node/dist/index.d.ts:60
