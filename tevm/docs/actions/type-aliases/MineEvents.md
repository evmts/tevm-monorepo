[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MineEvents

# Type Alias: MineEvents

> **MineEvents** = `object`

Defined in: packages/actions/types/Mine/MineEvents.d.ts:22

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

### onBlock()?

> `optional` **onBlock**: (`block`, `next?`) => `void`

Defined in: packages/actions/types/Mine/MineEvents.d.ts:28

Handler called for each new block mined

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

The newly mined block

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

***

### onLog()?

> `optional` **onLog**: (`log`, `receipt`, `next?`) => `void`

Defined in: packages/actions/types/Mine/MineEvents.d.ts:42

Handler called for each transaction log generated during mining

#### Parameters

##### log

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)\[`"logs"`\]\[`number`\]

The transaction log

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

The receipt containing the log

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

***

### onReceipt()?

> `optional` **onReceipt**: (`receipt`, `blockHash`, `next?`) => `void`

Defined in: packages/actions/types/Mine/MineEvents.d.ts:35

Handler called for each transaction receipt generated during mining

#### Parameters

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

The transaction receipt

##### blockHash

[`Hex`](../../index/type-aliases/Hex.md)

The hash of the block containing the receipt

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`
