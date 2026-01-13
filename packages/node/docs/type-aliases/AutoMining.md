[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / AutoMining

# Type Alias: AutoMining

> **AutoMining** = `object`

Defined in: [packages/node/src/MiningConfig.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L31)

Mining configuration that automatically mines blocks for every transaction.
Each transaction is immediately included in its own block.

## Example

```typescript
import { AutoMining } from '@tevm/node'

const value: AutoMining = {
  type: 'auto'
}
```

## Properties

### type

> **type**: `"auto"`

Defined in: [packages/node/src/MiningConfig.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L32)
