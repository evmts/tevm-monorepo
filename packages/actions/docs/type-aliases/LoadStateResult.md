[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / LoadStateResult

# Type Alias: LoadStateResult\<ErrorType\>

> **LoadStateResult**\<`ErrorType`\> = `object`

Defined in: [packages/actions/src/LoadState/LoadStateResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateResult.ts#L26)

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

Defined in: [packages/actions/src/LoadState/LoadStateResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateResult.ts#L30)

Description of the exception, if any occurred.
