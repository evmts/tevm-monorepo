[@evmts/effect](../README.md) / [Modules](../modules.md) / resolve

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

Ƭ **ResolveSafe**<\>: (`importPath`: `string`, `options`: `SyncOpts` & `AsyncOpts`) => `Effect`

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

[effect/src/resolve.js:10](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/resolve.js#L10)

## Functions

### resolveAsync

▸ **resolveAsync**(`importPath`, `options`): `Effect`<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

Effect wrpper around import('node:resolve')

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `options` | `Object` |

#### Returns

`Effect`<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@evmts/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````

#### Defined in

[effect/src/resolve.js:10](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/resolve.js#L10)

___

### resolveSync

▸ **resolveSync**(`importPath`, `options`): `Effect`<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

Effect wrapper around import('node:resolve').resolveSync

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `options` | `Object` |

#### Returns

`Effect`<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {resolveSync} from '@evmts/effect'
resolveSync('react').pipe(
   tap(console.log)
)
````
`

#### Defined in

[effect/src/resolve.js:10](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/resolve.js#L10)
