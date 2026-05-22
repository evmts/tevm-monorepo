[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MineEvents

# Type Alias: MineEvents

> **MineEvents** = `object`

Event handlers for mining operations

## Example

```typescript
import { createMemoryClient } from 'tevm'
import { mine } from 'tevm/actions'

const client = createMemoryClient()

const result = await mine(client, {
  blockCount: 1,
  onBlock: (block, next) => {
    console.log(`New block mined: ${block.header.number}`)
    next?.()
  }
})
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="onblock"></a> `onBlock?` | (`block`, `next?`) => `void` | Handler called for each new block mined |
| <a id="onlog"></a> `onLog?` | (`log`, `receipt`, `next?`) => `void` | Handler called for each transaction log generated during mining |
| <a id="onreceipt"></a> `onReceipt?` | (`receipt`, `blockHash`, `next?`) => `void` | Handler called for each transaction receipt generated during mining |
