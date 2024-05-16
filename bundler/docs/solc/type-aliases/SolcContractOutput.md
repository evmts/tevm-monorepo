[**@tevm/bundler**](../../README.md) • **Docs**

***

[@tevm/bundler](../../modules.md) / [solc](../README.md) / SolcContractOutput

# Type alias: SolcContractOutput

> **SolcContractOutput**: `object`

## Type declaration

### abi

> **abi**: `Abi`

### devdoc

> **devdoc**: `any`

### evm

> **evm**: [`SolcEVMOutput`](SolcEVMOutput.md)

### ewasm

> **ewasm**: [`SolcEwasmOutput`](SolcEwasmOutput.md)

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

bundler-packages/solc/types/src/solcTypes.d.ts:126
