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
| `readArtifactsSync` | `ReadArtifactsSync` |
| `readDts` | `ReadDts` |
| `readDtsSync` | `ReadDtsSync` |
| `readMjs` | `ReadMjs` |
| `readMjsSync` | `ReadMjsSync` |
| `writeArtifacts` | `WriteArtifacts` |
| `writeArtifactsSync` | `WriteArtifactsSync` |
| `writeDts` | `WriteDts` |
| `writeDtsSync` | `WriteDtsSync` |
| `writeMjs` | `WriteMjs` |
| `writeMjsSync` | `WriteMjsSync` |

#### Defined in

[types.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L58)

___

### CachedItem

Ƭ **CachedItem**: ``"artifactsJson"`` \| ``"dts"`` \| ``"mjs"``

#### Defined in

[types.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L22)

___

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

#### Type declaration

| Name | Type |
| :------ | :------ |
| `exists` | (`path`: `string`) => `Promise`\<`boolean`\> |
| `existsSync` | (`path`: `string`) => `boolean` |
| `mkdir` | typeof `mkdir` |
| `mkdirSync` | typeof `mkdirSync` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`\<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |
| `stat` | typeof `stat` |
| `statSync` | typeof `statSync` |
| `writeFile` | typeof `writeFile` |
| `writeFileSync` | (`path`: `string`, `data`: `string`) => `void` |

#### Defined in

[types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L9)

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

[createCache.js:14](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/createCache.js#L14)
