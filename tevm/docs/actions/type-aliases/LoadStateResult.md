[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / LoadStateResult

# Type Alias: LoadStateResult\<ErrorType\>

> **LoadStateResult**\<`ErrorType`\> = `object`

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

| Type Parameter | Default type |
| ------ | ------ |
| `ErrorType` | [`TevmLoadStateError`](TevmLoadStateError.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="errors"></a> `errors?` | `ErrorType`[] | Description of the exception, if any occurred. |
