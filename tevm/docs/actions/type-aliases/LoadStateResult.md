[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / LoadStateResult

# Type Alias: LoadStateResult\<ErrorType\>

> **LoadStateResult**\<`ErrorType`\> = `object`

Defined in: packages/actions/types/LoadState/LoadStateResult.d.ts:25

Result of the `tevmLoadState` method.

This type represents the result returned by the `tevmLoadState` method. It includes any errors that might have occurred during the state loading process.

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

## Type Parameters

### ErrorType

`ErrorType` = [`TevmLoadStateError`](TevmLoadStateError.md)

## Properties

### errors?

> `optional` **errors**: `ErrorType`[]

Defined in: packages/actions/types/LoadState/LoadStateResult.d.ts:29

Description of the exception, if any occurred.
