**@tevm/effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [resolve](../README.md) > resolveSync

# Function: resolveSync()

> **resolveSync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

Effect wrapper around import('node:resolve').resolveSync

## Parameters

▪ **importPath**: `string`

▪ **options**: `SyncOpts` & `AsyncOpts`

## Returns

## Example

```ts
import {tap} from 'effect/Effect'
import {resolveSync} from '@tevm/effect'
resolveSync('react').pipe(
   tap(console.log)
)
````
`

## Source

[packages/effect/src/resolve.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L46)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
