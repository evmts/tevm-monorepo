---
editUrl: false
next: false
prev: false
title: "tevmCall"
---

> **tevmCall**(`client`, `params`): `Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror/)\>\>

A tree-shakeable version of the `tevmCall` action for viem.
Executes a call against the VM. It is similar to `eth_call` but provides more options for controlling the execution environment.

By default, it does not modify the state after the call is complete, but this can be configured with the `createTransaction` option.

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

Parameters for the call, including the target address, call data, sender address, gas limit, gas price, and other options.

## Returns

`Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<[`TevmCallError`](/reference/tevm/actions/type-aliases/tevmcallerror/)\>\>

The result of the call.

## Example

```typescript
import { createClient, http } from 'viem'
import { tevmCall } from 'tevm/actions'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const res = await tevmCall(client, {
    to: '0x123...',
    data: '0x123...',
    from: '0x123...',
    gas: 1000000,
    gasPrice: 1n,
    skipBalance: true,
  })
  console.log(res)
}

example()
```

## See

 - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference.
 - [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 - [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)

## Defined in

[packages/memory-client/src/tevmCall.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmCall.js#L47)
