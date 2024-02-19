[@tevm/runtime](README.md) / Exports

# @tevm/runtime

## Table of contents

### Type Aliases

- [ModuleType](modules.md#moduletype)

### Functions

- [generateRuntime](modules.md#generateruntime)

## Type Aliases

### ModuleType

Ƭ **ModuleType**: ``"cjs"`` \| ``"dts"`` \| ``"ts"`` \| ``"mjs"``

#### Defined in

[types.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/runtime/src/types.ts#L1)

## Functions

### generateRuntime

▸ **generateRuntime**(`artifacts`, `moduleType`, `includeBytecode`, `tevmPackage`): `Effect`\<`never`, `never`, `string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `artifacts` | `Artifacts` |  |
| `moduleType` | [`ModuleType`](modules.md#moduletype) |  |
| `includeBytecode` | `boolean` |  |
| `tevmPackage` | ``"tevm/contract"`` \| ``"@tevm/contract"`` | Package to import contracts from |

#### Returns

`Effect`\<`never`, `never`, `string`\>

#### Defined in

[generateRuntime.js:28](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/runtime/src/generateRuntime.js#L28)
