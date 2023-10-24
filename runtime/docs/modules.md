[@evmts/runtime](README.md) / Exports

# @evmts/runtime

## Table of contents

### Type Aliases

- [ModuleType](modules.md#moduletype)

### Functions

- [generateDtsBody](modules.md#generatedtsbody)
- [generateEvmtsBody](modules.md#generateevmtsbody)
- [generateRuntime](modules.md#generateruntime)
- [generateRuntimeSync](modules.md#generateruntimesync)

## Type Aliases

### ModuleType

Ƭ **ModuleType**<\>: ``"cjs"`` \| ``"mjs"`` \| ``"ts"`` \| ``"dts"``

#### Defined in

[generateEvmtsBody.js:5](https://github.com/evmts/evmts-monorepo/blob/main/runtime/src/generateEvmtsBody.js#L5)

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

[generateEvmtsBodyDts.js:7](https://github.com/evmts/evmts-monorepo/blob/main/runtime/src/generateEvmtsBodyDts.js#L7)

___

### generateEvmtsBody

▸ **generateEvmtsBody**(`artifacts`, `moduleType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | [`ModuleType`](modules.md#moduletype) |

#### Returns

`string`

#### Defined in

[generateEvmtsBody.js:13](https://github.com/evmts/evmts-monorepo/blob/main/runtime/src/generateEvmtsBody.js#L13)

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

[generateRuntime.js:10](https://github.com/evmts/evmts-monorepo/blob/main/runtime/src/generateRuntime.js#L10)

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

[generateRuntimeSync.js:9](https://github.com/evmts/evmts-monorepo/blob/main/runtime/src/generateRuntimeSync.js#L9)
