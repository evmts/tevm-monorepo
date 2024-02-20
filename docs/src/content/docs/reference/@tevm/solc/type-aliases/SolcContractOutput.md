---
editUrl: false
next: false
prev: false
title: "SolcContractOutput"
---

> **SolcContractOutput**: `object`

## Type declaration

### abi

> **abi**: `Abi`

### devdoc

> **devdoc**: `any`

### evm

> **evm**: [`SolcEVMOutput`](/reference/tevm/solc/type-aliases/solcevmoutput/)

### ewasm

> **ewasm**: [`SolcEwasmOutput`](/reference/tevm/solc/type-aliases/solcewasmoutput/)

### ir

> **ir**: `string`

### metadata

> **metadata**: `string`

### storageLayout

> **storageLayout**: `object`

### storageLayout.storage

> **storageLayout.storage**: `any`[]

### storageLayout.types

> **storageLayout.types**: `any`

### userdoc

> **userdoc**: `object`

### userdoc.kind

> **userdoc.kind**: `"user"`

### userdoc.methods

> **userdoc.methods**?: `Record`\<`string`, `object`\>

### userdoc.notice

> **userdoc.notice**?: `string`

### userdoc.version

> **userdoc.version**: `number`

## Source

[solcTypes.ts:403](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L403)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
