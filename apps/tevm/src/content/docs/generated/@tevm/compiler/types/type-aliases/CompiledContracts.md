---
editUrl: false
next: false
prev: false
title: "CompiledContracts"
---

> **CompiledContracts**\<`TIncludeAsts`\>: `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TIncludeAsts` extends `boolean` | `boolean` |

## Type declaration

### artifacts

> **artifacts**: `SolcOutput`[`"contracts"`][`string`] \| `undefined`

### asts

> **asts**: `TIncludeAsts` extends `true` ? `Record`\<`string`, `Node`\> : `undefined`

### modules

> **modules**: `Record`\<`"string"`, [`ModuleInfo`](/generated/tevm/compiler/types/type-aliases/moduleinfo/)\>

### solcInput

> **solcInput**: `SolcInputDescription`

### solcOutput

> **solcOutput**: `SolcOutput`

## Source

[compiler/src/types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/bundler/compiler/src/types.ts#L56)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
