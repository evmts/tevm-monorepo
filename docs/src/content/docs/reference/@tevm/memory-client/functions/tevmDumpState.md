---
editUrl: false
next: false
prev: false
title: "tevmDumpState"
---

> **tevmDumpState**(`client`): `Promise`\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult/)\<[`TevmDumpStateError`](/reference/tevm/actions/type-aliases/tevmdumpstateerror/)\>\>

A tree-shakeable version of the `tevmDumpState` action for viem.
Dumps the state of TEVM into a plain JavaScript object that can later be used to restore state
using the `tevmLoadState` action.

This action is useful for persisting and restoring the state between different sessions or processes.

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult/)\<[`TevmDumpStateError`](/reference/tevm/actions/type-aliases/tevmdumpstateerror/)\>\>

The dump of the TEVM state.

## Example

```typescript
import { tevmDumpState } from 'tevm/actions'
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
  const state = await tevmDumpState(client)
  fs.writeFileSync('state.json', JSON.stringify(state))
  console.log('State dumped to state.json')
}

example()
```

## See

 - [DumpStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/dumpstateresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [tevmLoadState](https://tevm.sh/reference/tevm/actions/functions/tevmLoadState/) for restoring the state.

## Defined in

[packages/memory-client/src/tevmDumpState.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDumpState.js#L41)
