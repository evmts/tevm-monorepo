[@evmts/bundler](/reference/bundler/README.md) / [Modules](/reference/bundler/modules.md) / runtime

# Module: runtime

## Table of contents

### Type Aliases

- [ModuleType](/reference/bundler/modules/runtime.md#moduletype)

### Functions

- [generateDtsBody](/reference/bundler/modules/runtime.md#generatedtsbody)
- [generateEvmtsBody](/reference/bundler/modules/runtime.md#generateevmtsbody)
- [generateRuntime](/reference/bundler/modules/runtime.md#generateruntime)
- [generateRuntimeSync](/reference/bundler/modules/runtime.md#generateruntimesync)

## Type Aliases

### ModuleType

Ƭ **ModuleType**<\>: ``"cjs"`` \| ``"mjs"`` \| ``"ts"`` \| ``"dts"``

#### Defined in

[bundlers/bundler/src/runtime/generateEvmtsBody.js:5](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateEvmtsBody.js#L5)

## Functions

### generateDtsBody

▸ **generateDtsBody**(`artifacts`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |

#### Returns

`string`

#### Defined in

[bundlers/bundler/src/runtime/generateEvmtsBodyDts.js:7](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateEvmtsBodyDts.js#L7)

___

### generateEvmtsBody

▸ **generateEvmtsBody**(`artifacts`, `moduleType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | [`ModuleType`](/reference/bundler/modules/runtime.md#moduletype) |

#### Returns

`string`

#### Defined in

[bundlers/bundler/src/runtime/generateEvmtsBody.js:13](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateEvmtsBody.js#L13)

___

### generateRuntime

▸ **generateRuntime**(`artifacts`, `moduleType`, `logger`): `Promise`<`string`\>

Generates the runtime code for the given artifacts.

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | ``"cjs"`` \| ``"mjs"`` \| ``"ts"`` |
| `logger` | `Logger` |

#### Returns

`Promise`<`string`\>

#### Defined in

[bundlers/bundler/src/runtime/generateRuntime.js:10](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateRuntime.js#L10)

___

### generateRuntimeSync

▸ **generateRuntimeSync**(`artifacts`, `moduleType`, `logger`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | ``"cjs"`` \| ``"mjs"`` \| ``"ts"`` \| ``"dts"`` |
| `logger` | `Logger` |

#### Returns

`string`

#### Defined in

[bundlers/bundler/src/runtime/generateRuntimeSync.js:9](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateRuntimeSync.js#L9)
