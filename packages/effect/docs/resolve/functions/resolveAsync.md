[**@tevm/effect**](../../README.md) • **Docs**

***

[@tevm/effect](../../modules.md) / [resolve](../README.md) / resolveAsync

# Function: resolveAsync()

> **resolveAsync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

Effect wrpper around import('node:resolve')

## Parameters

• **importPath**: `string`

• **options**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

## Example

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@tevm/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````

## Source

[packages/effect/src/resolve.js:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L65)
