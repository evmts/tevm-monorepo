[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / IntervalMining

# Type Alias: IntervalMining

> **IntervalMining**: `object`

Defined in: packages/node/dist/index.d.ts:118

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
