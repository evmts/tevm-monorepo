[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallEvents

# Type Alias: CallEvents

> **CallEvents** = `object`

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

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="onaftermessage"></a> `onAfterMessage?` | (`data`, `next?`) => `void` | Handler called after a message (call) is processed |
| <a id="onbeforemessage"></a> `onBeforeMessage?` | (`data`, `next?`) => `void` | Handler called before a message (call) is processed |
| <a id="onnewcontract"></a> `onNewContract?` | (`data`, `next?`) => `void` | Handler called when a new contract is created |
| <a id="onstep"></a> `onStep?` | (`data`, `next?`) => `void` | Handler called on each EVM step (instruction execution) |
