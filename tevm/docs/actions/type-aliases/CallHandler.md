[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallHandler

# Type Alias: CallHandler()

> **CallHandler** = (`action`) => `Promise`\<[`CallResult`](CallResult.md)\>

Defined in: packages/actions/types/Call/CallHandlerType.d.ts:48

Executes a call against the VM, similar to `eth_call` but with more options for controlling the execution environment.

This low-level function is used internally by higher-level functions like `contract` and `script`, which are designed to interact with deployed contracts or undeployed scripts, respectively.

## Parameters

### action

[`CallHandlerParams`](CallHandlerParams.md)

The parameters for the call, including optional event handlers.

## Returns

`Promise`\<[`CallResult`](CallResult.md)\>

The result of the call, including execution details and any returned data.

## Throws

If `throwOnFail` is true, returns `TevmCallError` as value.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { callHandler } from 'tevm/actions'

const client = createTevmNode()

const call = callHandler(client)

const res = await call({
  to: '0x123...',
  data: '0x123...',
  from: '0x123...',
  gas: 1000000n,
  gasPrice: 1n,
  skipBalance: true,
  // Optional event handlers
  onStep: (step, next) => {
    console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
    next?.()
  }
})

console.log(res)
```

## See

 - [tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall)
 - [CallParams](CallParams.md)
 - [CallResult](CallResult.md)
