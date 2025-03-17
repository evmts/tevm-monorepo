[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallEvents

# Type Alias: CallEvents

> **CallEvents**: `object`

Defined in: packages/actions/dist/index.d.ts:138

Event handlers for EVM execution during a call

## Type declaration

### onAfterMessage()?

> `optional` **onAfterMessage**: (`data`, `next`?) => `void`

Handler called after a message (call) is processed

#### Parameters

##### data

[`EvmResult`](../../evm/interfaces/EvmResult.md)

Result information

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

### onBeforeMessage()?

> `optional` **onBeforeMessage**: (`data`, `next`?) => `void`

Handler called before a message (call) is processed

#### Parameters

##### data

[`Message`](../interfaces/Message.md)

Message information

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

### onNewContract()?

> `optional` **onNewContract**: (`data`, `next`?) => `void`

Handler called when a new contract is created

#### Parameters

##### data

[`NewContractEvent`](../interfaces/NewContractEvent.md)

Contract creation information

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

### onStep()?

> `optional` **onStep**: (`data`, `next`?) => `void`

Handler called on each EVM step (instruction execution)

#### Parameters

##### data

[`InterpreterStep`](../../evm/interfaces/InterpreterStep.md)

Step information including opcode, stack, and memory state

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

## Example

```typescript
import { createMemoryClient } from 'tevm'
import { tevmCall } from 'tevm/actions'

const client = createMemoryClient()

const result = await tevmCall(client, {
  to: '0x1234...',
  data: '0xabcdef...',
  onStep: (step, next) => {
    console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
    next?.()
  }
})
```
