[@evmts/runtime](README.md) / Exports

# @evmts/runtime

## Table of contents

### Type Aliases

- [ModuleType](modules.md#moduletype)

### Functions

- [generateRuntime](modules.md#generateruntime)

## Type Aliases

### ModuleType

Ƭ **ModuleType**: ``"cjs"`` \| ``"dts"`` \| ``"ts"`` \| ``"mjs"``

#### Defined in

[types.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundler/runtime/src/types.ts#L1)

## Functions

### generateRuntime

▸ **generateRuntime**(`artifacts`, `moduleType`, `includeBytecode`): `Effect`\<`never`, `never`, `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `moduleType` | [`ModuleType`](modules.md#moduletype) |
| `includeBytecode` | `boolean` |

#### Returns

`Effect`\<`never`, `never`, `string`\>

#### Defined in

[generateRuntime.js:17](https://github.com/evmts/evmts-monorepo/blob/main/bundler/runtime/src/generateRuntime.js#L17)
