[@tevm/tsupconfig](README.md) / Exports

# @tevm/tsupconfig

## Table of contents

### Variables

- [browser](modules.md#browser)
- [js](modules.md#js)
- [node](modules.md#node)

### Functions

- [createTsUpOptions](modules.md#createtsupoptions)

## Variables

### browser

• `Const` **browser**: `Options`

#### Defined in

[browser.js:3](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/browser.js#L3)

___

### js

• `Const` **js**: `Options`

#### Defined in

[js.js:3](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/js.js#L3)

___

### node

• `Const` **node**: `Options`

#### Defined in

[node.js:3](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/node.js#L3)

## Functions

### createTsUpOptions

▸ **createTsUpOptions**(`options`): `Options`

Creates tsup options from params

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` |  |
| `options.entry` | `undefined` \| `string`[] | `undefined` | entry points Defaults to src/index.js |
| `options.format` | `undefined` \| (``"cjs"`` \| ``"esm"``)[] | `undefined` | module format Defaults to cjs and esm |
| `options.outDir` | `undefined` \| `string` | `'dist'` | output directory Defaults to dist |
| `options.target` | `undefined` \| `Target` | `'js'` | environment to target Defaults to js |

#### Returns

`Options`

#### Defined in

[createTsupOptions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/createTsupOptions.js#L14)
