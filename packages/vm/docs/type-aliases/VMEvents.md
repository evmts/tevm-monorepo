[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / VMEvents

# Type Alias: VMEvents

> **VMEvents** = `object`

Defined in: [packages/vm/src/utils/VMEvents.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMEvents.ts#L32)

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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="afterblock"></a> `afterBlock` | (`data`, `resolve?`) => `void` | [packages/vm/src/utils/VMEvents.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMEvents.ts#L34) |
| <a id="aftertx"></a> `afterTx` | (`data`, `resolve?`) => `void` | [packages/vm/src/utils/VMEvents.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMEvents.ts#L36) |
| <a id="beforeblock"></a> `beforeBlock` | (`data`, `resolve?`) => `void` | [packages/vm/src/utils/VMEvents.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMEvents.ts#L33) |
| <a id="beforetx"></a> `beforeTx` | (`data`, `resolve?`) => `void` | [packages/vm/src/utils/VMEvents.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMEvents.ts#L35) |
