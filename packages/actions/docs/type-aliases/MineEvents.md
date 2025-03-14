[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MineEvents

# Type Alias: MineEvents

> **MineEvents**: `object`

Defined in: [packages/actions/src/Mine/MineEvents.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineEvents.ts#L23)

Event handlers for mining operations

## Type declaration

### onBlock()?

> `optional` **onBlock**: (`block`, `next`?) => `void`

Handler called for each new block mined

#### Parameters

##### block

`Block`

The newly mined block

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

### onLog()?

> `optional` **onLog**: (`log`, `receipt`, `next`?) => `void`

Handler called for each transaction log generated during mining

#### Parameters

##### log

`TxReceipt`\[`"logs"`\]\[`number`\]

The transaction log

##### receipt

`TxReceipt`

The receipt containing the log

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

### onReceipt()?

> `optional` **onReceipt**: (`receipt`, `blockHash`, `next`?) => `void`

Handler called for each transaction receipt generated during mining

#### Parameters

##### receipt

`TxReceipt`

The transaction receipt

##### blockHash

`Hex`

The hash of the block containing the receipt

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

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
