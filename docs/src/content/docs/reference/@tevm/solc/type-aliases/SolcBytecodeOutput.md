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

#### Index signature

 \[`functionName`: `string`\]: [`SolcFunctionDebugData`](/reference/tevm/solc/type-aliases/solcfunctiondebugdata/)

### generatedSources

> **generatedSources**: [`SolcGeneratedSource`](/reference/tevm/solc/type-aliases/solcgeneratedsource/)[]

### linkReferences

> **linkReferences**: `object`

#### Index signature

 \[`fileName`: `string`\]: `object`

### object

> **object**: `string`

### opcodes

> **opcodes**: `string`

### sourceMap

> **sourceMap**: `string`

## Source

[solcTypes.ts:459](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L459)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
