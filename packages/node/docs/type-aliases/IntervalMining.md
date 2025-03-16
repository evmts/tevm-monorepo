[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / IntervalMining

# Type Alias: IntervalMining

> **IntervalMining**: `object`

Defined in: [packages/node/src/MiningConfig.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L13)

Mining configuration that creates blocks at fixed time intervals.

## Type declaration

### interval

> **interval**: `number`

### type

> **type**: `"interval"`

## Example

```typescript
import { IntervalMining } from '@tevm/node'

const value: IntervalMining = {
  type: 'interval',
  interval: 5000 // Mine blocks every 5 seconds
}
```
