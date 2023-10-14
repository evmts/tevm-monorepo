[@evmts/bundler](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / createCache

# Module: createCache

## Table of contents

### Type Aliases

- [Cache](/reference/schema/modules/createCache.md#cache)

### Functions

- [createCache](/reference/schema/modules/createCache.md#createcache)

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

[bundlers/bundler/src/createCache.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/createCache.ts#L8)

## Functions

### createCache

▸ **createCache**(`logger`): [`Cache`](/reference/schema/modules/createCache.md#cache)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |

#### Returns

[`Cache`](/reference/schema/modules/createCache.md#cache)

#### Defined in

[bundlers/bundler/src/createCache.ts:17](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/createCache.ts#L17)
