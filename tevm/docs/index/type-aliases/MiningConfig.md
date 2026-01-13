[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / MiningConfig

# Type Alias: MiningConfig

> **MiningConfig** = [`ManualMining`](ManualMining.md) \| [`AutoMining`](AutoMining.md) \| [`IntervalMining`](../../node/type-aliases/IntervalMining.md)

Defined in: packages/node/dist/index.d.ts:105

Configuration options for controlling block mining behavior.
Union of all mining strategy types.

## Example

```typescript
import { MiningConfig } from '@tevm/node'
import { createMemoryClient } from 'tevm'

// Choose one of the mining strategies
const miningConfig: MiningConfig = {
  type: 'auto' // Mine automatically after each transaction
}

const client = createMemoryClient({
  mining: miningConfig
})
```
