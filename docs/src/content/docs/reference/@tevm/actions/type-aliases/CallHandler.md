---
editUrl: false
next: false
prev: false
title: "CallHandler"
---

> **CallHandler**: (`action`) => `Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\>

Executes a call against the VM, similar to `eth_call` but with more options for controlling the execution environment.

This low-level function is used internally by higher-level functions like `contract` and `script`, which are designed to interact with deployed contracts or undeployed scripts, respectively.

## Parameters

• **action**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)

The parameters for the call.

## Returns

`Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\>

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
})

console.log(res)
```

## See

 - [tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall)
 - [CallParams](../../../../../../../reference/tevm/actions/type-aliases/callparams)
 - [CallResult](../../../../../../../reference/tevm/actions/type-aliases/callresult)

## Defined in

[packages/actions/src/Call/CallHandlerType.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallHandlerType.ts#L38)
