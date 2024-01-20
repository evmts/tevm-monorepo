**tevm** ∙ [README](../../../README.md) ∙ [API](../../../API.md)

***

[API](../../../API.md) > [bundler/solc](../README.md) > SolcContractOutput

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

bundler/solc/types/src/solcTypes.d.ts:126

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
