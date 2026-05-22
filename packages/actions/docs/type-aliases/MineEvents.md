[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MineEvents

# Type Alias: MineEvents

> **MineEvents** = `object`

Defined in: [packages/actions/src/Mine/MineEvents.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineEvents.ts#L23)

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

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="onblock"></a> `onBlock?` | (`block`, `next?`) => `void` | Handler called for each new block mined | [packages/actions/src/Mine/MineEvents.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineEvents.ts#L29) |
| <a id="onlog"></a> `onLog?` | (`log`, `receipt`, `next?`) => `void` | Handler called for each transaction log generated during mining | [packages/actions/src/Mine/MineEvents.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineEvents.ts#L45) |
| <a id="onreceipt"></a> `onReceipt?` | (`receipt`, `blockHash`, `next?`) => `void` | Handler called for each transaction receipt generated during mining | [packages/actions/src/Mine/MineEvents.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineEvents.ts#L37) |
