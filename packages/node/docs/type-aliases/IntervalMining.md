[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / IntervalMining

# Type Alias: IntervalMining

> **IntervalMining** = `object`

Defined in: [packages/node/src/MiningConfig.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L53)

Mining configuration that automatically mines blocks at a specified interval.
When the interval is 0, blocks are only mined via manual calls to anvil_mine.

## Example

```typescript
import { IntervalMining } from '@tevm/node'

const value: IntervalMining = {
  type: 'interval',
  blockTime: 5 // Mine a block every 5 seconds
}

// To disable automatic interval mining but allow anvil_mine:
const manualValue: IntervalMining = {
  type: 'interval',
  blockTime: 0
}
```

## Properties

### blockTime

> **blockTime**: `number`

Defined in: [packages/node/src/MiningConfig.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L58)

The block time in seconds. When set to 0, blocks are only mined manually via anvil_mine.

***

### type

> **type**: `"interval"`

Defined in: [packages/node/src/MiningConfig.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L54)
