[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / IntervalMining

# Type Alias: IntervalMining

> **IntervalMining** = `object`

Defined in: [packages/node/src/MiningConfig.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L13)

Mining configuration that creates blocks at fixed time intervals.

## Example

```typescript
import { IntervalMining } from '@tevm/node'

const value: IntervalMining = {
  type: 'interval',
  interval: 5000 // Mine blocks every 5 seconds
}
```

## Properties

### interval

> **interval**: `number`

Defined in: [packages/node/src/MiningConfig.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L15)

***

### type

> **type**: `"interval"`

Defined in: [packages/node/src/MiningConfig.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L14)
