---
editUrl: false
next: false
prev: false
title: "tevmLoadState"
---

> **tevmLoadState**(`client`, `params`): `Promise`\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\<[`InternalError`](/reference/tevm/errors/classes/internalerror/)\>\>

A tree-shakeable version of the `tevmLoadState` action for viem.
Loads the state into TEVM from a plain JavaScript object.

This action is useful for restoring the state that was previously dumped using the `tevmDumpState` action.

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`LoadStateParams`](/reference/tevm/actions/type-aliases/loadstateparams/)\<`boolean`\>

The state to load into TEVM.

## Returns

`Promise`\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\<[`InternalError`](/reference/tevm/errors/classes/internalerror/)\>\>

The result of loading the state.

## Example

```typescript
import { tevmLoadState } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'
import fs from 'fs'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const state = JSON.parse(fs.readFileSync('state.json', 'utf8'))
  const result = await tevmLoadState(client, state)
  console.log('State loaded:', result)
}

example()
```

## See

 - [LoadStateParams](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateparams/) for options reference.
 - [LoadStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [tevmDumpState](https://tevm.sh/reference/tevm/actions/functions/tevmDumpState/) for dumping the state.

## Defined in

[packages/memory-client/src/tevmLoadState.js:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmLoadState.js#L42)
