[@evmts/runtime](README.md) / Exports

# @evmts/runtime

## Table of contents

### Type Aliases

- [ModuleType](undefined)

### Functions

- [generateRuntime](undefined)

## Type Aliases

### ModuleType

Ƭ **ModuleType**: "cjs" \| "dts" \| "ts" \| "mjs"

#### Defined in

[types.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundler/runtime/src/types.ts#L1)

## Functions

### generateRuntime

▸ **generateRuntime**(`artifacts`, `moduleType`): Effect<never, never, string\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | Artifacts |
| `moduleType` | ModuleType |

#### Returns

Effect<never, never, string\>

#### Defined in

[generateRuntime.js:16](https://github.com/evmts/evmts-monorepo/blob/main/bundler/runtime/src/generateRuntime.js#L16)
