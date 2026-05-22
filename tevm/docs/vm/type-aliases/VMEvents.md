[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMEvents

# Type Alias: VMEvents

> **VMEvents** = `object`

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

| Property | Type |
| ------ | ------ |
| <a id="afterblock"></a> `afterBlock` | (`data`, `resolve?`) => `void` |
| <a id="aftertx"></a> `afterTx` | (`data`, `resolve?`) => `void` |
| <a id="beforeblock"></a> `beforeBlock` | (`data`, `resolve?`) => `void` |
| <a id="beforetx"></a> `beforeTx` | (`data`, `resolve?`) => `void` |
