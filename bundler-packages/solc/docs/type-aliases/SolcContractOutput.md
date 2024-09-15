[**@tevm/solc**](../README.md) • **Docs**

***

[@tevm/solc](../globals.md) / SolcContractOutput

# Type Alias: SolcContractOutput

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

## Defined in

[solcTypes.ts:395](https://github.com/qbzzt/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L395)
