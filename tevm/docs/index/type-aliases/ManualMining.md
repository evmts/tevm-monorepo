[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ManualMining

# Type Alias: ManualMining

> **ManualMining**: `object`

Defined in: packages/node/dist/index.d.ts:137

Mining configuration where blocks are only created when explicitly requested.
Transactions remain in the mempool until manually mined.

## Type declaration

### type

> **type**: `"manual"`

## Example

```typescript
import { ManualMining } from '@tevm/node'

const value: ManualMining = {
  type: 'manual'
}

// Later blocks can be mined manually:
// await client.mine({ blocks: 1 })
```
