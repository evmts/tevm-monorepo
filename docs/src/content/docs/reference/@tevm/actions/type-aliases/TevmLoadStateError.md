---
editUrl: false
next: false
prev: false
title: "TevmLoadStateError"
---

> **TevmLoadStateError**: [`InternalError`](/reference/tevm/errors/classes/internalerror/)

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

[InternalError](../../../../../../../../reference/tevm/errors/classes/internalerror)

## Defined in

[packages/actions/src/LoadState/TevmLoadStateError.ts:26](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/LoadState/TevmLoadStateError.ts#L26)
