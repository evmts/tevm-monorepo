[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmLoadStateError

# Type Alias: TevmLoadStateError

> **TevmLoadStateError**: [`InternalError`](../../errors/classes/InternalError.md)

Defined in: packages/actions/dist/index.d.ts:2442

Error type for `tevmLoadState`.

This type represents the possible errors that can occur during the execution of the `tevmLoadState` method.

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

[InternalError](../../errors/classes/InternalError.md)
