**@tevm/effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [resolve](../README.md) > resolveAsync

# Function: resolveAsync()

> **resolveAsync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

Effect wrpper around import('node:resolve')

## Parameters

▪ **importPath**: `string`

▪ **options**: `SyncOpts` & `AsyncOpts`

## Returns

## Example

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@tevm/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````

## Source

[packages/effect/src/resolve.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L76)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
