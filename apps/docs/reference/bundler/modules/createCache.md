[@evmts/bundler](/reference/bundler/README.md) / [Modules](/reference/bundler/modules.md) / createCache

# Module: createCache

## Table of contents

### Type Aliases

- [Cache](/reference/bundler/modules/createCache.md#cache)

### Functions

- [createCache](/reference/bundler/modules/createCache.md#createcache)

## Type Aliases

### Cache

Ƭ **Cache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `isCached` | (`entryModuleId`: `string`, `sources`: `SolcInputDescription`[``"sources"``]) => `boolean` |
| `read` | (`entryModuleId`: `string`) => `SolcOutput` |
| `write` | (`entryModuleId`: `string`, `compiledContracts`: `SolcOutput`) => `void` |

#### Defined in

[createCache.d.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/createCache.d.ts#L8)

## Functions

### createCache

▸ **createCache**(`logger`): [`Cache`](/reference/bundler/modules/createCache.md#cache)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |

#### Returns

[`Cache`](/reference/bundler/modules/createCache.md#cache)

#### Defined in

[createCache.d.ts:17](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/createCache.d.ts#L17)
