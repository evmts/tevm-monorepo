[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / ManualMining

# Type Alias: ManualMining

> **ManualMining** = `object`

Defined in: [packages/node/src/MiningConfig.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L16)

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

Defined in: [packages/node/src/MiningConfig.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L17)
