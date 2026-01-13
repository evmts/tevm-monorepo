[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [node](../README.md) / IntervalMining

# Type Alias: IntervalMining

> **IntervalMining** = `object`

Defined in: packages/node/dist/index.d.ts:80

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

Defined in: packages/node/dist/index.d.ts:85

The block time in seconds. When set to 0, blocks are only mined manually via anvil_mine.

***

### type

> **type**: `"interval"`

Defined in: packages/node/dist/index.d.ts:81
