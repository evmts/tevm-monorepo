[@evmts/bundler](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / unplugin

# Module: unplugin

## Table of contents

### Type Aliases

- [CompilerOption](/reference/schema/modules/unplugin.md#compileroption)

### Functions

- [esbuildPluginEvmts](/reference/schema/modules/unplugin.md#esbuildpluginevmts)
- [rollupPluginEvmts](/reference/schema/modules/unplugin.md#rolluppluginevmts)
- [rspackPluginEvmts](/reference/schema/modules/unplugin.md#rspackpluginevmts)
- [unpluginFn](/reference/schema/modules/unplugin.md#unpluginfn)
- [vitePluginEvmts](/reference/schema/modules/unplugin.md#vitepluginevmts)
- [webpackPluginEvmts](/reference/schema/modules/unplugin.md#webpackpluginevmts)

## Type Aliases

### CompilerOption

Ƭ **CompilerOption**: `z.infer`<typeof `compilerOptionValidator`\>

#### Defined in

[bundlers/bundler/src/unplugin.ts:17](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/unplugin.ts#L17)

## Functions

### esbuildPluginEvmts

▸ **esbuildPluginEvmts**(`options?`): `Plugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"foundry"`` \| ``"solc"`` |

#### Returns

`Plugin`

#### Defined in

node_modules/.pnpm/unplugin@1.5.0/node_modules/unplugin/dist/index.d.mts:83

___

### rollupPluginEvmts

▸ **rollupPluginEvmts**(`options?`): `Plugin`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"foundry"`` \| ``"solc"`` |

#### Returns

`Plugin`<`any`\>

#### Defined in

node_modules/.pnpm/unplugin@1.5.0/node_modules/unplugin/dist/index.d.mts:83

___

### rspackPluginEvmts

▸ **rspackPluginEvmts**(`options?`): `RspackPluginInstance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"foundry"`` \| ``"solc"`` |

#### Returns

`RspackPluginInstance`

#### Defined in

node_modules/.pnpm/unplugin@1.5.0/node_modules/unplugin/dist/index.d.mts:83

___

### unpluginFn

▸ **unpluginFn**(`options`, `meta`): `UnpluginOptions`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| { `compiler?`: ``"foundry"`` \| ``"solc"``  } |
| `meta` | `UnpluginContextMeta` |

#### Returns

`UnpluginOptions`

#### Defined in

node_modules/.pnpm/unplugin@1.5.0/node_modules/unplugin/dist/index.d.mts:82

___

### vitePluginEvmts

▸ **vitePluginEvmts**(`options?`): `Plugin`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"foundry"`` \| ``"solc"`` |

#### Returns

`Plugin`<`any`\>

#### Defined in

node_modules/.pnpm/unplugin@1.5.0/node_modules/unplugin/dist/index.d.mts:83

___

### webpackPluginEvmts

▸ **webpackPluginEvmts**(`options?`): `RspackPluginInstance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.compiler?` | ``"foundry"`` \| ``"solc"`` |

#### Returns

`RspackPluginInstance`

#### Defined in

node_modules/.pnpm/unplugin@1.5.0/node_modules/unplugin/dist/index.d.mts:83
