[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / LoadStateParams

# Type Alias: LoadStateParams\<TThrowOnFail\>

> **LoadStateParams**\<`TThrowOnFail`\> = [`BaseParams`](BaseParams.md)\<`TThrowOnFail`\> & `object`

Defined in: [packages/actions/src/LoadState/LoadStateParams.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateParams.ts#L25)

Parameters for the `tevmLoadState` method.

This method takes a SerializableTevmState object and loads it into the VM state.

## Type Declaration

### state

> `readonly` **state**: `SerializableTevmState`

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
