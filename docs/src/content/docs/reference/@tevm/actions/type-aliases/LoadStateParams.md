---
editUrl: false
next: false
prev: false
title: "LoadStateParams"
---

> **LoadStateParams**\<`TThrowOnFail`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnFail`\> & `object`

Parameters for the `tevmLoadState` method.

This method takes a TevmState object and loads it into the VM state.

## Type declaration

### state

> `readonly` **state**: `TevmState`

The TEVM state object to load.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

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

## Defined in

[packages/actions/src/LoadState/LoadStateParams.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/LoadStateParams.ts#L25)
