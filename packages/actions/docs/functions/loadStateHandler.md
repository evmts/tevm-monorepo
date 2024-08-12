[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / loadStateHandler

# Function: loadStateHandler()

> **loadStateHandler**(`client`, `options`?): [`LoadStateHandler`](../type-aliases/LoadStateHandler.md)

Creates a handler for loading a previously dumped state into the VM.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The base client instance.

• **options?** = `{}`

Optional configuration.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error when a failure occurs.

## Returns

[`LoadStateHandler`](../type-aliases/LoadStateHandler.md)

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

 - [LoadStateParams](../type-aliases/LoadStateParams.md)
 - [LoadStateResult](../type-aliases/LoadStateResult.md)
 - [TevmLoadStateError](../type-aliases/TevmLoadStateError.md)

## Defined in

[packages/actions/src/LoadState/loadStateHandler.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/loadStateHandler.js#L35)
