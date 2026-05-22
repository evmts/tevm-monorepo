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

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="onaftermessage"></a> `onAfterMessage?` | (`data`, `next?`) => `void` | Handler called after a message (call) is processed | [packages/actions/src/common/CallEvents.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L93) |
| <a id="onbeforemessage"></a> `onBeforeMessage?` | (`data`, `next?`) => `void` | Handler called before a message (call) is processed | [packages/actions/src/common/CallEvents.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L86) |
| <a id="onnewcontract"></a> `onNewContract?` | (`data`, `next?`) => `void` | Handler called when a new contract is created | [packages/actions/src/common/CallEvents.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L79) |
| <a id="onstep"></a> `onStep?` | (`data`, `next?`) => `void` | Handler called on each EVM step (instruction execution) | [packages/actions/src/common/CallEvents.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L72) |
