---
editUrl: false
next: false
prev: false
title: "SolcBytecodeOutput"
---

> **SolcBytecodeOutput**: `object` & `Omit`\<[`SolcDeployedBytecodeOutput`](/reference/tevm/solc/type-aliases/solcdeployedbytecodeoutput/), `"immutableReferences"`\>

## Type declaration

### functionDebugData

> **functionDebugData**: `object`

#### Index Signature

 \[`functionName`: `string`\]: [`SolcFunctionDebugData`](/reference/tevm/solc/type-aliases/solcfunctiondebugdata/)

### generatedSources

> **generatedSources**: [`SolcGeneratedSource`](/reference/tevm/solc/type-aliases/solcgeneratedsource/)[]

### linkReferences

> **linkReferences**: `object`

#### Index Signature

 \[`fileName`: `string`\]: `object`

### object

> **object**: `string`

### opcodes

> **opcodes**: `string`

### sourceMap

> **sourceMap**: `string`

## Defined in

[solcTypes.ts:451](https://github.com/qbzzt/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L451)
