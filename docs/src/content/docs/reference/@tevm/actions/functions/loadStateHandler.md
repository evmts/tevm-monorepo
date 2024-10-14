---
editUrl: false
next: false
prev: false
title: "loadStateHandler"
---

> **loadStateHandler**(`client`, `options`?): [`LoadStateHandler`](/reference/tevm/actions/type-aliases/loadstatehandler/)

Creates a handler for loading a previously dumped state into the VM.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The base client instance.

• **options?** = `{}`

Optional configuration.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error when a failure occurs.

## Returns

[`LoadStateHandler`](/reference/tevm/actions/type-aliases/loadstatehandler/)

- The handler function.

## Example

```typescript
import { createClient } from 'tevm'
import { loadStateHandler } from 'tevm/actions'
import fs from 'fs'

const client = createClient()
const loadState = loadStateHandler(client)

const state = JSON.parse(fs.readFileSync('state.json'))
const result = await loadState({ state })
if (result.errors) {
  console.error('Failed to load state:', result.errors)
}
```

## See

 - [LoadStateParams](../../../../../../../../reference/tevm/actions/type-aliases/loadstateparams)
 - [LoadStateResult](../../../../../../../../reference/tevm/actions/type-aliases/loadstateresult)
 - [TevmLoadStateError](../../../../../../../../reference/tevm/actions/type-aliases/tevmloadstateerror)

## Defined in

[packages/actions/src/LoadState/loadStateHandler.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/loadStateHandler.js#L35)
