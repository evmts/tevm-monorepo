[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMEvents

# Type Alias: VMEvents

> **VMEvents** = `object`

Defined in: packages/vm/types/utils/VMEvents.d.ts:31

Event handlers for the VM execution lifecycle.
Allows subscribing to events before and after block/transaction processing.

## Example

```typescript
import { VMEvents } from '@tevm/vm'
import { VM } from '@tevm/vm'

const vm = new VM()

// Add event handlers
const handlers: Partial<VMEvents> = {
  beforeBlock: (block) => {
    console.log(`Processing block ${block.header.number}`)
  },
  afterTx: (data) => {
    console.log(`Transaction executed with status: ${data.execResult.exceptionError ? 'failed' : 'success'}`)
  }
}

// Register handlers
Object.entries(handlers).forEach(([event, handler]) => {
  vm.events.on(event, handler)
})
```

## Properties

### afterBlock()

> **afterBlock**: (`data`, `resolve`?) => `void`

Defined in: packages/vm/types/utils/VMEvents.d.ts:33

#### Parameters

##### data

[`AfterBlockEvent`](../interfaces/AfterBlockEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

***

### afterTx()

> **afterTx**: (`data`, `resolve`?) => `void`

Defined in: packages/vm/types/utils/VMEvents.d.ts:35

#### Parameters

##### data

[`AfterTxEvent`](../interfaces/AfterTxEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

***

### beforeBlock()

> **beforeBlock**: (`data`, `resolve`?) => `void`

Defined in: packages/vm/types/utils/VMEvents.d.ts:32

#### Parameters

##### data

[`Block`](../../block/classes/Block.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

***

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

Defined in: packages/vm/types/utils/VMEvents.d.ts:34

#### Parameters

##### data

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`
