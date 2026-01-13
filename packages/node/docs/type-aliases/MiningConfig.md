[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / MiningConfig

# Type Alias: MiningConfig

> **MiningConfig** = [`ManualMining`](ManualMining.md) \| [`AutoMining`](AutoMining.md) \| [`IntervalMining`](IntervalMining.md)

Defined in: [packages/node/src/MiningConfig.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/MiningConfig.ts#L78)

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
