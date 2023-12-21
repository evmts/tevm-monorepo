[@tevm/base](../README.md) / [Modules](../modules.md) / createCache

# Module: createCache

## Table of contents

### Type Aliases

- [Cache](createCache.md#cache)

### Functions

- [createCache](createCache.md#createcache)

## Type Aliases

### Cache

Ƭ **Cache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `isCached` | (`entryModuleId`: `string`, `sources`: `SolcInputDescription`[``"sources"``], `cachedItem`: `CachedItem`) => `boolean` |
| `read` | `ReadFunction` |
| `write` | `WriteFunction` |

#### Defined in

[createCache.d.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler/base/src/createCache.d.ts#L22)

## Functions

### createCache

▸ **createCache**(`logger`, `cacheDir`, `fs`, `cwd`): [`Cache`](createCache.md#cache)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |
| `cacheDir` | `string` |
| `fs` | `FileAccessObject` |
| `cwd` | `string` |

#### Returns

[`Cache`](createCache.md#cache)

#### Defined in

[createCache.d.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/bundler/base/src/createCache.d.ts#L32)
