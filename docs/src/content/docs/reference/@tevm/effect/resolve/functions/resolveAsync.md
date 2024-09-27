---
editUrl: false
next: false
prev: false
title: "resolveAsync"
---

> **resolveAsync**(`arg0`, `arg1`): `Effect`\<`string`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `never`\>

Effect wrpper around import('node:resolve')

## Parameters

• **arg0**: `string`

• **arg1**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`string`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `never`\>

## Example

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@tevm/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````

## Defined in

[packages/effect/src/resolve.js:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L65)
