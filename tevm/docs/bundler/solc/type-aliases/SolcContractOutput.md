[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcContractOutput

# Type Alias: SolcContractOutput

> **SolcContractOutput**: `object`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:126

## Type declaration

### abi

> **abi**: [`Abi`](../../../index/type-aliases/Abi.md)

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

> **storageLayout**: [`SolcStorageLayout`](SolcStorageLayout.md)

### userdoc

> **userdoc**: `object`

#### userdoc.kind

> **kind**: `"user"`

#### userdoc.methods?

> `optional` **methods**: `Record`\<`string`, \{ `notice`: `string`; \}\>

#### userdoc.notice?

> `optional` **notice**: `string`

#### userdoc.version

> **version**: `number`
