[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / LoadStateResult

# Type Alias: LoadStateResult\<ErrorType\>

> **LoadStateResult**\<`ErrorType`\>: `object`

Result of the `tevmLoadState` method.

This type represents the result returned by the `tevmLoadState` method. It includes any errors that might have occurred during the state loading process.

## Type Parameters

• **ErrorType** = [`TevmLoadStateError`](TevmLoadStateError.md)

## Type declaration

### errors?

> `optional` **errors**: `ErrorType`[]

Description of the exception, if any occurred.

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

[TevmLoadStateError](TevmLoadStateError.md)

## Defined in

[packages/actions/src/LoadState/LoadStateResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateResult.ts#L26)
