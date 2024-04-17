**@tevm/effect** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/effect](../../README.md) / [resolve](../README.md) / resolveSync

# Function: resolveSync()

> **resolveSync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

Effect wrapper around import('node:resolve').resolveSync

## Parameters

• **importPath**: `string`

• **options**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

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

[packages/effect/src/resolve.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L52)
