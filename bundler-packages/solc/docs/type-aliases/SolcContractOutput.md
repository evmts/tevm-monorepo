[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcContractOutput

# Type Alias: SolcContractOutput

> **SolcContractOutput**: `object`

Defined in: [solcTypes.ts:395](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L395)

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
