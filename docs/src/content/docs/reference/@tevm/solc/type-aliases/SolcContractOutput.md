---
editUrl: false
next: false
prev: false
title: "SolcContractOutput"
---

> **SolcContractOutput**: `object`

## Type declaration

### abi

> **abi**: [`Abi`](/reference/tevm/utils/type-aliases/abi/)

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

> **storage**: `any`[]

### storageLayout.types

> **types**: `any`

### userdoc

> **userdoc**: `object`

### userdoc.kind

> **kind**: `"user"`

### userdoc.methods?

> `optional` **methods**: `Record`\<`string`, `object`\>

### userdoc.notice?

> `optional` **notice**: `string`

### userdoc.version

> **version**: `number`

## Source

[solcTypes.ts:395](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L395)
