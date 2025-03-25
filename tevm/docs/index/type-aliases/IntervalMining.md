[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / IntervalMining

# Type Alias: IntervalMining

> **IntervalMining** = `object`

Defined in: packages/node/dist/index.d.ts:118

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

Defined in: packages/node/dist/index.d.ts:120

***

### type

> **type**: `"interval"`

Defined in: packages/node/dist/index.d.ts:119
