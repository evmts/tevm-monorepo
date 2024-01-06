[@tevm/runtime](README.md) / Exports

# @tevm/runtime

## Table of contents

### Type Aliases

- [ModuleType](undefined)

### Functions

- [generateRuntime](undefined)

## Type Aliases

### ModuleType

Ƭ **ModuleType**: "cjs" \| "dts" \| "ts" \| "mjs"

#### Defined in

[types.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/bundler/runtime/src/types.ts#L1)

## Functions

### generateRuntime

▸ **generateRuntime**(`artifacts`, `moduleType`, `includeBytecode`): Effect\<never, never, string\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `artifacts` | Artifacts$1 |
| `moduleType` | ModuleType |
| `includeBytecode` | boolean |

#### Returns

Effect\<never, never, string\>

#### Defined in

[generateRuntime.js:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler/runtime/src/generateRuntime.js#L17)
