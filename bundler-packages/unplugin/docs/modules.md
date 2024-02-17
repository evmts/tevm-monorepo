[@tevm/unplugin](README.md) / Exports

# @tevm/unplugin

## Table of contents

### Type Aliases

- [CompilerOption](modules.md#compileroption)

### Functions

- [createUnplugin](modules.md#createunplugin)
- [tevmUnplugin](modules.md#tevmunplugin)

## Type Aliases

### CompilerOption

Ƭ **CompilerOption**\<\>: `infer`

#### Defined in

[bundler-packages/unplugin/src/tevmUnplugin.js:30](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/unplugin/src/tevmUnplugin.js#L30)

## Functions

### createUnplugin

▸ **createUnplugin**\<`UserOptions`, `Nested`\>(`factory`): `UnpluginInstance`\<`UserOptions`, `Nested`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `UserOptions` | `UserOptions` |
| `Nested` | extends `boolean` = `boolean` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `UnpluginFactory`\<`UserOptions`, `Nested`\> |

#### Returns

`UnpluginInstance`\<`UserOptions`, `Nested`\>

#### Defined in

node_modules/.pnpm/unplugin@1.5.1/node_modules/unplugin/dist/index.d.mts:120

___

### tevmUnplugin

▸ **tevmUnplugin**(`options`, `meta`): `UnpluginOptions`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| \{ `solc?`: `SolcVersions`  } |
| `meta` | `UnpluginContextMeta` |

#### Returns

`UnpluginOptions`

#### Defined in

[bundler-packages/unplugin/src/tevmUnplugin.js:40](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/unplugin/src/tevmUnplugin.js#L40)
