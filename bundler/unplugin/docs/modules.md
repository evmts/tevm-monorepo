[@evmts/unplugin](README.md) / Exports

# @evmts/unplugin

## Table of contents

### Type Aliases

- [CompilerOption](modules.md#compileroption)

### Functions

- [createUnplugin](modules.md#createunplugin)
- [evmtsUnplugin](modules.md#evmtsunplugin)

## Type Aliases

### CompilerOption

Ƭ **CompilerOption**\<\>: `infer`

#### Defined in

[bundler/unplugin/src/evmtsUnplugin.js:15](https://github.com/evmts/evmts-monorepo/blob/main/bundler/unplugin/src/evmtsUnplugin.js#L15)

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

### evmtsUnplugin

▸ **evmtsUnplugin**(`options`, `meta`): `UnpluginOptions`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| \{ `compiler?`: ``"solc"`` \| ``"foundry"``  } |
| `meta` | `UnpluginContextMeta` |

#### Returns

`UnpluginOptions`

#### Defined in

node_modules/.pnpm/unplugin@1.5.1/node_modules/unplugin/dist/index.d.mts:82
