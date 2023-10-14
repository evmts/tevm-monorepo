[@evmts/bundler](/reference/bundler/README.md) / [Modules](/reference/bundler/modules.md) / runtime

# Module: runtime

## Table of contents

### Functions

- [generateDtsBody](/reference/bundler/modules/runtime.md#generatedtsbody)
- [generateEvmtsBody](/reference/bundler/modules/runtime.md#generateevmtsbody)
- [generateRuntime](/reference/bundler/modules/runtime.md#generateruntime)
- [generateRuntimeSync](/reference/bundler/modules/runtime.md#generateruntimesync)

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

[bundlers/bundler/src/runtime/generateEvmtsBodyDts.ts:4](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateEvmtsBodyDts.ts#L4)

___

### generateEvmtsBody

▸ **generateEvmtsBody**(`artifacts`, `moduleType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | `ModuleType` |

#### Returns

`string`

#### Defined in

[bundlers/bundler/src/runtime/generateEvmtsBody.ts:7](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateEvmtsBody.ts#L7)

___

### generateRuntime

▸ **generateRuntime**(`artifacts`, `moduleType`, `logger`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | ``"cjs"`` \| ``"mjs"`` \| ``"ts"`` |
| `logger` | `Logger` |

#### Returns

`Promise`<`string`\>

#### Defined in

[bundlers/bundler/src/runtime/generateRuntime.ts:6](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateRuntime.ts#L6)

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

[bundlers/bundler/src/runtime/generateRuntimeSync.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/runtime/generateRuntimeSync.ts#L5)
