[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / LoadStateParams

# Type Alias: LoadStateParams\<TThrowOnFail\>

> **LoadStateParams**\<`TThrowOnFail`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnFail`\> & `object`

Defined in: packages/actions/types/LoadState/LoadStateParams.d.ts:24

Parameters for the `tevmLoadState` method.

This method takes a [SerializableTevmState](../../state/type-aliases/SerializableTevmState.md) object and loads it into the VM state.

## Type Declaration

### state

> `readonly` **state**: [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

The TEVM state object to load.

## Type Parameters

### TThrowOnFail

`TThrowOnFail` *extends* `boolean` = `boolean`

Optional parameter to throw an error on failure.

## Example

```typescript
import { createClient } from 'tevm'
import { loadStateHandler } from 'tevm/actions'
import fs from 'fs'

const client = createClient()
const loadState = loadStateHandler(client)

const state = JSON.parse(fs.readFileSync('state.json'))
await loadState({ state })
```

## Param

The TEVM state object to load.
