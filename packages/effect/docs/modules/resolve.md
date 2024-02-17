[@tevm/effect](../README.md) / [Modules](../modules.md) / resolve

# Module: resolve

## Table of contents

### Classes

- [CouldNotResolveImportError](../classes/resolve.CouldNotResolveImportError.md)

### Type Aliases

- [ResolveSafe](resolve.md#resolvesafe)

### Functions

- [resolveAsync](resolve.md#resolveasync)
- [resolveSync](resolve.md#resolvesync)

## Type Aliases

### ResolveSafe

Ƭ **ResolveSafe**\<\>: (`importPath`: `string`, `options`: `SyncOpts` & `AsyncOpts`) => `Effect`

#### Type declaration

▸ (`importPath`, `options`): `Effect`

##### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `options` | `SyncOpts` & `AsyncOpts` |

##### Returns

`Effect`

#### Defined in

[evmts-monorepo/packages/effect/src/resolve.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L10)

## Functions

### resolveAsync

▸ **resolveAsync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

Effect wrpper around import('node:resolve')

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `options` | `SyncOpts` & `AsyncOpts` |

#### Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@tevm/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````

#### Defined in

[evmts-monorepo/packages/effect/src/resolve.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L76)

___

### resolveSync

▸ **resolveSync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

Effect wrapper around import('node:resolve').resolveSync

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `options` | `SyncOpts` & `AsyncOpts` |

#### Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {resolveSync} from '@tevm/effect'
resolveSync('react').pipe(
   tap(console.log)
)
````
`

#### Defined in

[evmts-monorepo/packages/effect/src/resolve.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L52)
