---
editUrl: false
next: false
prev: false
title: "resolveSync"
---

> **resolveSync**(`arg0`, `arg1`): `Effect`\<`string`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `never`\>

Effect wrapper around import('node:resolve').resolveSync

## Parameters

• **arg0**: `string`

• **arg1**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`string`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `never`\>

## Example

```ts
import {tap} from 'effect/Effect'
import {resolveSync} from '@tevm/effect'
resolveSync('react').pipe(
   tap(console.log)
)
````
`

## Defined in

[packages/effect/src/resolve.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L46)
