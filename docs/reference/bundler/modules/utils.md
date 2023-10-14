[@evmts/bundler](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / utils

# Module: utils

## Table of contents

### Functions

- [formatPath](/reference/schema/modules/utils.md#formatpath)
- [invariant](/reference/schema/modules/utils.md#invariant)
- [isImportLocal](/reference/schema/modules/utils.md#isimportlocal)
- [isRelativeSolidity](/reference/schema/modules/utils.md#isrelativesolidity)
- [isSolidity](/reference/schema/modules/utils.md#issolidity)
- [resolveEffect](/reference/schema/modules/utils.md#resolveeffect)

## Functions

### formatPath

▸ **formatPath**(`contractPath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractPath` | `string` |

#### Returns

`string`

#### Defined in

[bundlers/bundler/src/utils/formatPath.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/formatPath.ts#L1)

___

### invariant

▸ **invariant**(`condition`, `message`): asserts condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `any` |
| `message` | `string` |

#### Returns

asserts condition

#### Defined in

[bundlers/bundler/src/utils/invariant.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/invariant.ts#L1)

___

### isImportLocal

▸ **isImportLocal**(`importPath`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |

#### Returns

`boolean`

#### Defined in

[bundlers/bundler/src/utils/isImportLocal.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/isImportLocal.ts#L1)

___

### isRelativeSolidity

▸ **isRelativeSolidity**(`fileName`): `boolean`

Util to determine if a file path is a solidity file referenced via a relative import

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |

#### Returns

`boolean`

#### Defined in

[bundlers/bundler/src/utils/isRelativeSolidity.ts:6](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/isRelativeSolidity.ts#L6)

___

### isSolidity

▸ **isSolidity**(`fileName`): `boolean`

Util to determine if a file path is a solidity file

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |

#### Returns

`boolean`

#### Defined in

[bundlers/bundler/src/utils/isSolidity.ts:4](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/isSolidity.ts#L4)

___

### resolveEffect

▸ **resolveEffect**(`filePath`, `basedir`, `fao`, `logger`): `Effect`<`never`, `Error`, `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `basedir` | `string` |
| `fao` | `FileAccessObject` |
| `logger` | `Logger` |

#### Returns

`Effect`<`never`, `Error`, `string`\>

#### Defined in

[bundlers/bundler/src/utils/resolvePromise.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/resolvePromise.ts#L5)
