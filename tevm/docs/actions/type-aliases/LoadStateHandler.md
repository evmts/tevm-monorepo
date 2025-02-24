[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions](../README.md) / LoadStateHandler

# Type Alias: LoadStateHandler()

> **LoadStateHandler**: (`params`) => `Promise`\<[`LoadStateResult`](../../index/type-aliases/LoadStateResult.md)\>

Loads a previously dumped state into the VM.

State can be dumped as follows:

## Parameters

• **params**: [`LoadStateParams`](LoadStateParams.md)

The parameters for loading the state.

## Returns

`Promise`\<[`LoadStateResult`](../../index/type-aliases/LoadStateResult.md)\>

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

packages/actions/types/LoadState/LoadStateHandlerType.d.ts:39
