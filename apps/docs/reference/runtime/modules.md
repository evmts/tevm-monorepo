[@tevm/runtime](/reference/runtime/README.md) / Exports

# @tevm/runtime

## Table of contents

### Type Aliases

- [ModuleType](/reference/runtime/modules.md#moduletype)

### Functions

- [generateDtsBody](/reference/runtime/modules.md#generatedtsbody)
- [generateTevmBody](/reference/runtime/modules.md#generatetevmbody)
- [generateRuntime](/reference/runtime/modules.md#generateruntime)
- [generateRuntimeSync](/reference/runtime/modules.md#generateruntimesync)

## Type Aliases

### ModuleType

Ƭ **ModuleType**<\>: ``"cjs"`` \| ``"mjs"`` \| ``"ts"`` \| ``"dts"``

#### Defined in

[generateTevmBody.js:5](https://github.com/evmts/tevm-monorepo/blob/main/runtime/src/generateTevmBody.js#L5)

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

[generateTevmBodyDts.js:7](https://github.com/evmts/tevm-monorepo/blob/main/runtime/src/generateTevmBodyDts.js#L7)

___

### generateTevmBody

▸ **generateTevmBody**(`artifacts`, `moduleType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | [`ModuleType`](/reference/runtime/modules.md#moduletype) |

#### Returns

`string`

#### Defined in

[generateTevmBody.js:13](https://github.com/evmts/tevm-monorepo/blob/main/runtime/src/generateTevmBody.js#L13)

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

[generateRuntime.js:10](https://github.com/evmts/tevm-monorepo/blob/main/runtime/src/generateRuntime.js#L10)

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

[generateRuntimeSync.js:9](https://github.com/evmts/tevm-monorepo/blob/main/runtime/src/generateRuntimeSync.js#L9)
