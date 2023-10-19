[@evmts/bundler](/reference/bundler/README.md) / [Modules](/reference/bundler/modules.md) / unplugin

# Module: unplugin

## Table of contents

### Type Aliases

- [CompilerOption](/reference/bundler/modules/unplugin.md#compileroption)

### Functions

- [esbuildPluginEvmts](/reference/bundler/modules/unplugin.md#esbuildpluginevmts)
- [rollupPluginEvmts](/reference/bundler/modules/unplugin.md#rolluppluginevmts)
- [rspackPluginEvmts](/reference/bundler/modules/unplugin.md#rspackpluginevmts)
- [unpluginFn](/reference/bundler/modules/unplugin.md#unpluginfn)
- [vitePluginEvmts](/reference/bundler/modules/unplugin.md#vitepluginevmts)
- [webpackPluginEvmts](/reference/bundler/modules/unplugin.md#webpackpluginevmts)

## Type Aliases

### CompilerOption

Ƭ **CompilerOption**<\>: `infer`

#### Defined in

[bundlers/bundler/src/unplugin.js:16](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/unplugin.js#L16)

## Functions

### esbuildPluginEvmts

▸ **esbuildPluginEvmts**(`options?`): `Plugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"solc"`` \| ``"foundry"`` |

#### Returns

`Plugin`

#### Defined in

node_modules/unplugin/dist/index.d.mts:83

___

### rollupPluginEvmts

▸ **rollupPluginEvmts**(`options?`): `Plugin`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"solc"`` \| ``"foundry"`` |

#### Returns

`Plugin`<`any`\>

#### Defined in

node_modules/unplugin/dist/index.d.mts:83

___

### rspackPluginEvmts

▸ **rspackPluginEvmts**(`options?`): `RspackPluginInstance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"solc"`` \| ``"foundry"`` |

#### Returns

`RspackPluginInstance`

#### Defined in

node_modules/unplugin/dist/index.d.mts:83

___

### unpluginFn

▸ **unpluginFn**(`options`, `meta`): `UnpluginOptions`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| { `compiler?`: ``"solc"`` \| ``"foundry"``  } |
| `meta` | `UnpluginContextMeta` |

#### Returns

`UnpluginOptions`

#### Defined in

node_modules/unplugin/dist/index.d.mts:82

___

### vitePluginEvmts

▸ **vitePluginEvmts**(`options?`): `Plugin`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"solc"`` \| ``"foundry"`` |

#### Returns

`Plugin`<`any`\>

#### Defined in

node_modules/unplugin/dist/index.d.mts:83

___

### webpackPluginEvmts

▸ **webpackPluginEvmts**(`options?`): `RspackPluginInstance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"solc"`` \| ``"foundry"`` |

#### Returns

`RspackPluginInstance`

#### Defined in

node_modules/unplugin/dist/index.d.mts:83
