---
editUrl: false
next: false
prev: false
title: "LoadStateHandler"
---

> **LoadStateHandler**: (`params`) => `Promise`\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\>

Loads a previously dumped state into the VM.

State can be dumped as follows:

## Parameters

• **params**: [`LoadStateParams`](/reference/tevm/actions/type-aliases/loadstateparams/)

The parameters for loading the state.

## Returns

`Promise`\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\>

The result of the load state operation.

## Examples

```typescript
import { dumpStateHandler } from 'tevm/actions'
import { createClient } from 'tevm'
import fs from 'fs'

const client = createClient()
const dumpState = dumpStateHandler(client)

const { state } = await dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows:

```typescript
import { loadStateHandler } from 'tevm/actions'
import { createClient } from 'tevm'
import fs from 'fs'

const client = createClient()
const loadState = loadStateHandler(client)

const state = JSON.parse(fs.readFileSync('state.json'))
await loadState({ state })
```

Note: This handler is intended for use with the low-level TEVM TevmNode, unlike `tevmLoadState` which is a higher-level API function.

## Defined in

[packages/actions/src/LoadState/LoadStateHandlerType.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateHandlerType.ts#L40)
