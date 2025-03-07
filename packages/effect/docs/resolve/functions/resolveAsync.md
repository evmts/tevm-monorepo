[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [resolve](../README.md) / resolveAsync

# Function: resolveAsync()

> **resolveAsync**(`arg0`, `arg1`): `Effect`\<`string`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `never`\>

Defined in: [packages/effect/src/resolve.js:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L65)

Effect wrpper around import('node:resolve')

## Parameters

### arg0

`string`

### arg1

`SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`string`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `never`\>

## Example

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@tevm/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````
