[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallEvents

# Type Alias: CallEvents

> **CallEvents** = `object`

Defined in: [packages/actions/src/common/CallEvents.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L66)

Event handlers for EVM execution during a call

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

## Properties

### onAfterMessage()?

> `optional` **onAfterMessage**: (`data`, `next?`) => `void`

Defined in: [packages/actions/src/common/CallEvents.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L93)

Handler called after a message (call) is processed

#### Parameters

##### data

`EvmResult`

Result information

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`

***

### onBeforeMessage()?

> `optional` **onBeforeMessage**: (`data`, `next?`) => `void`

Defined in: [packages/actions/src/common/CallEvents.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L86)

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

***

### onNewContract()?

> `optional` **onNewContract**: (`data`, `next?`) => `void`

Defined in: [packages/actions/src/common/CallEvents.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L79)

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

***

### onStep()?

> `optional` **onStep**: (`data`, `next?`) => `void`

Defined in: [packages/actions/src/common/CallEvents.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L72)

Handler called on each EVM step (instruction execution)

#### Parameters

##### data

`InterpreterStep`

Step information including opcode, stack, and memory state

##### next?

() => `void`

Function to continue execution - must be called to proceed

#### Returns

`void`
