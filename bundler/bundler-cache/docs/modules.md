[@tevm/bundler-cache](README.md) / Exports

# @tevm/bundler-cache

## Table of contents

### Type Aliases

- [Cache](modules.md#cache)
- [CachedItem](modules.md#cacheditem)
- [FileAccessObject](modules.md#fileaccessobject)

### Functions

- [createCache](modules.md#createcache)

## Type Aliases

### Cache

Ƭ **Cache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `readArtifacts` | `ReadArtifacts` |
| `readDts` | `ReadDts` |
| `readMjs` | `ReadMjs` |
| `writeArtifacts` | `WriteArtifacts` |
| `writeDts` | `WriteDts` |
| `writeMjs` | `WriteMjs` |

#### Defined in

[types.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L35)

___

### CachedItem

Ƭ **CachedItem**: ``"artifactsJson"`` \| ``"dts"`` \| ``"mjs"``

#### Defined in

[types.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L16)

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
| `statSync` | typeof `statSync` |
| `writeFileSync` | (`path`: `string`, `data`: `string`) => `void` |

#### Defined in

[types.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/types.ts#L8)

## Functions

### createCache

▸ **createCache**(`cacheDir`, `fs`, `cwd`): [`Cache`](modules.md#cache)

Creates a Tevm cache object for reading and writing cached items

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheDir` | `string` |
| `fs` | [`FileAccessObject`](modules.md#fileaccessobject) |
| `cwd` | `string` |

#### Returns

[`Cache`](modules.md#cache)

#### Defined in

[createCache.js:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bundler-cache/src/createCache.js#L12)
