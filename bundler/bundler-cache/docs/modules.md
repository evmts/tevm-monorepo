[@tevm/bundler-cache](README.md) / Exports

# @tevm/bundler-cache

## Table of contents

### Type Aliases

- [Cache](modules.md#cache)
- [CachedItem](modules.md#cacheditem)
- [CreateCache](modules.md#createcache)
- [FileAccessObject](modules.md#fileaccessobject)
- [Logger](modules.md#logger)

### Functions

- [createCache](modules.md#createcache-1)

## Type Aliases

### Cache

Ƭ **Cache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `isCached` | (`entryModuleId`: `string`, `sources`: `SolcInputDescription`[``"sources"``], `cachedItem`: [`CachedItem`](modules.md#cacheditem)) => `boolean` |
| `read` | `ReadFunction` |
| `write` | `WriteFunction` |

#### Defined in

[types.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L39)

___

### CachedItem

Ƭ **CachedItem**: ``"artifactsJson"`` \| ``"dts"`` \| ``"mjs"``

#### Defined in

[types.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L21)

___

### CreateCache

Ƭ **CreateCache**: (`logger`: [`Logger`](modules.md#logger), `cacheDir`: `string`, `fs`: [`FileAccessObject`](modules.md#fileaccessobject), `cwd`: `string`) => [`Cache`](modules.md#cache)

#### Type declaration

▸ (`logger`, `cacheDir`, `fs`, `cwd`): [`Cache`](modules.md#cache)

##### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](modules.md#logger) |
| `cacheDir` | `string` |
| `fs` | [`FileAccessObject`](modules.md#fileaccessobject) |
| `cwd` | `string` |

##### Returns

[`Cache`](modules.md#cache)

#### Defined in

[types.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L49)

___

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

#### Type declaration

| Name | Type |
| :------ | :------ |
| `existsSync` | (`path`: `string`) => `boolean` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`\<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |
| `writeFileSync` | (`path`: `string`, `data`: `string`) => `void` |

#### Defined in

[types.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L7)

___

### Logger

Ƭ **Logger**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | (...`message`: `string`[]) => `void` |
| `info` | (...`messages`: `string`[]) => `void` |
| `log` | (...`message`: `string`[]) => `void` |
| `warn` | (...`message`: `string`[]) => `void` |

#### Defined in

[types.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L14)

## Functions

### createCache

▸ **createCache**(`logger`, `cacheDir`, `fs`, `cwd`): [`Cache`](modules.md#cache)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](modules.md#logger) |
| `cacheDir` | `string` |
| `fs` | [`FileAccessObject`](modules.md#fileaccessobject) |
| `cwd` | `string` |

#### Returns

[`Cache`](modules.md#cache)

#### Defined in

[types.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L49)
