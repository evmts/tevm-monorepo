[@evmts/resolutions](README.md) / Exports

# @evmts/resolutions

## Table of contents

### Interfaces

- [ModuleInfo](interfaces/ModuleInfo.md)

### Type Aliases

- [FileAccessObject](modules.md#fileaccessobject)
- [Logger](modules.md#logger)

### Functions

- [moduleFactory](modules.md#modulefactory)
- [moduleFactorySync](modules.md#modulefactorysync)
- [resolveImports](modules.md#resolveimports)

## Type Aliases

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `existsSync` | (`path`: `string`) => `boolean` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |

#### Defined in

[types.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/resolutions/src/types.ts#L1)

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

[types.ts:7](https://github.com/evmts/evmts-monorepo/blob/main/resolutions/src/types.ts#L7)

## Functions

### moduleFactory

▸ **moduleFactory**(`absolutePath`, `rawCode`, `remappings`, `libs`, `fao`): `Promise`<[`ModuleInfo`](interfaces/ModuleInfo.md)\>

Creates a module from the given module information.
This includes resolving all imports and creating a dependency graph.

Currently it modifies the source code in place which causes the ast to not match the source code.
This complexity leaks to the typescript lsp which has to account for this
Ideally we refactor this to not need to modify source code in place
Doing this hurts our ability to control the import graph and make it use node resolution though
See foundry that is alergic to using npm
Doing it this way for now is easier but for sure a leaky abstraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `absolutePath` | `string` |
| `rawCode` | `string` |
| `remappings` | `Record`<`string`, `string`\> |
| `libs` | readonly `string`[] |
| `fao` | [`FileAccessObject`](modules.md#fileaccessobject) |

#### Returns

`Promise`<[`ModuleInfo`](interfaces/ModuleInfo.md)\>

#### Defined in

[importResolution/moduleFactory.js:22](https://github.com/evmts/evmts-monorepo/blob/main/resolutions/src/importResolution/moduleFactory.js#L22)

___

### moduleFactorySync

▸ **moduleFactorySync**(`absolutePath`, `rawCode`, `remappings`, `libs`, `fao`): [`ModuleInfo`](interfaces/ModuleInfo.md)

Creates a module from the given module information.
This includes resolving all imports and creating a dependency graph.

Currently it modifies the source code in place which causes the ast to not match the source code.
This complexity leaks to the typescript lsp which has to account for this
Ideally we refactor this to not need to modify source code in place
Doing this hurts our ability to control the import graph and make it use node resolution though
See foundry that is alergic to using npm
Doing it this way for now is easier but for sure a leaky abstraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `absolutePath` | `string` |
| `rawCode` | `string` |
| `remappings` | `Record`<`string`, `string`\> |
| `libs` | readonly `string`[] |
| `fao` | [`FileAccessObject`](modules.md#fileaccessobject) |

#### Returns

[`ModuleInfo`](interfaces/ModuleInfo.md)

#### Defined in

[importResolution/moduleFactorySync.js:22](https://github.com/evmts/evmts-monorepo/blob/main/resolutions/src/importResolution/moduleFactorySync.js#L22)

___

### resolveImports

▸ **resolveImports**(`absolutePath`, `code`): readonly `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `absolutePath` | `string` |
| `code` | `string` |

#### Returns

readonly `string`[]

#### Defined in

[importResolution/resolveImports.js:10](https://github.com/evmts/evmts-monorepo/blob/main/resolutions/src/importResolution/resolveImports.js#L10)
