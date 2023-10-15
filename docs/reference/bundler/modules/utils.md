[@evmts/bundler](/reference/bundler/README.md) / [Modules](/reference/bundler/modules.md) / utils

# Module: utils

## Table of contents

### Functions

- [formatPath](/reference/bundler/modules/utils.md#formatpath)
- [invariant](/reference/bundler/modules/utils.md#invariant)
- [isImportLocal](/reference/bundler/modules/utils.md#isimportlocal)
- [isRelativeSolidity](/reference/bundler/modules/utils.md#isrelativesolidity)
- [isSolidity](/reference/bundler/modules/utils.md#issolidity)
- [resolveEffect](/reference/bundler/modules/utils.md#resolveeffect)

## Functions

### formatPath

▸ **formatPath**(`contractPath`): `string`

Formats a path to be used in the contract loader

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractPath` | `string` | The path to the contract |

#### Returns

`string`

- The formatted path

#### Defined in

[bundlers/bundler/src/utils/formatPath.js:6](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/formatPath.js#L6)

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

[bundlers/bundler/src/utils/invariant.d.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/invariant.d.ts#L1)

___

### isImportLocal

▸ **isImportLocal**(`importPath`): `boolean`

Check if import path is local

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |

#### Returns

`boolean`

#### Defined in

[bundlers/bundler/src/utils/isImportLocal.js:6](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/isImportLocal.js#L6)

___

### isRelativeSolidity

▸ **isRelativeSolidity**(`fileName`): `boolean`

Util to determine if a file path is a solidity file referenced via a relative import

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | The file path to check |

#### Returns

`boolean`

True if the file path is a solidity file referenced via a relative import

#### Defined in

[bundlers/bundler/src/utils/isRelativeSolidity.js:8](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/isRelativeSolidity.js#L8)

___

### isSolidity

▸ **isSolidity**(`fileName`): `boolean`

Util to determine if a file path is a solidity file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | The file name to check |

#### Returns

`boolean`

- Whether or not the file is a solidity file

#### Defined in

[bundlers/bundler/src/utils/isSolidity.js:6](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/isSolidity.js#L6)

___

### resolveEffect

▸ **resolveEffect**(`filePath`, `basedir`, `fao`, `logger`): `Effect`<`never`, `Error`, `string`\>

import resolve from 'resolve wrapped in an effect

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

[bundlers/bundler/src/utils/resolvePromise.js:12](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/utils/resolvePromise.js#L12)
