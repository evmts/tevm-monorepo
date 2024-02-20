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

> **artifacts**: [`SolcOutput`](/reference/tevm/solc/type-aliases/solcoutput/)[`"contracts"`][`string`] \| `undefined`

### asts

> **asts**: `TIncludeAsts` extends `true` ? `Record`\<`string`, `Node`\> : `undefined`

### modules

> **modules**: `Record`\<`"string"`, [`ModuleInfo`](/reference/tevm/compiler/types/type-aliases/moduleinfo/)\>

### solcInput

> **solcInput**: [`SolcInputDescription`](/reference/tevm/solc/type-aliases/solcinputdescription/)

### solcOutput

> **solcOutput**: [`SolcOutput`](/reference/tevm/solc/type-aliases/solcoutput/)

## Source

[compiler/src/types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L56)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
