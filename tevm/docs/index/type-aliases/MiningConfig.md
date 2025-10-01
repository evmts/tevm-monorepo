[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / MiningConfig

# Type Alias: MiningConfig

> **MiningConfig** = [`IntervalMining`](IntervalMining.md) \| [`ManualMining`](ManualMining.md) \| [`AutoMining`](AutoMining.md) \| `GasMining`

Defined in: packages/node/dist/index.d.ts:113

Configuration options for controlling block mining behavior.
Union of all mining strategy types.

## Example

```typescript
import { MiningConfig } from '@tevm/node'
import { createMemoryClient } from 'tevm'

// Choose one of the mining strategies
const miningConfig: MiningConfig = {
  type: 'interval',
  interval: 2000 // Mine every 2 seconds
}

const client = createMemoryClient({
  mining: miningConfig
})
```
