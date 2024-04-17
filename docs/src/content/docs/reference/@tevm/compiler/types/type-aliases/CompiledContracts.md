---
editUrl: false
next: false
prev: false
title: "CompiledContracts"
---

> **CompiledContracts**\<`TIncludeAsts`\>: `object`

## Type parameters

• **TIncludeAsts** extends `boolean` = `boolean`

## Type declaration

### artifacts

> **artifacts**: [`SolcOutput`](/reference/solc/type-aliases/solcoutput/)\[`"contracts"`\]\[`string`\] \| `undefined`

### asts

> **asts**: `TIncludeAsts` extends `true` ? `Record`\<`string`, `Node`\> : `undefined`

### modules

> **modules**: `Record`\<`"string"`, [`ModuleInfo`](/reference/tevm/compiler/types/type-aliases/moduleinfo/)\>

### solcInput

> **solcInput**: [`SolcInputDescription`](/reference/solc/type-aliases/solcinputdescription/)

### solcOutput

> **solcOutput**: [`SolcOutput`](/reference/solc/type-aliases/solcoutput/)

## Source

[compiler/src/types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L56)
