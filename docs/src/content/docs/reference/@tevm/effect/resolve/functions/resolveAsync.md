---
editUrl: false
next: false
prev: false
title: "resolveAsync"
---

> **resolveAsync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `string`\>

Effect wrpper around import('node:resolve')

## Parameters

• **importPath**: `string`

• **options**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `string`\>

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
