**@tevm/solc** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/solc](../README.md) / SolcContractOutput

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

> **`optional`** **methods**: `Record`\<`string`, `object`\>

### userdoc.notice?

> **`optional`** **notice**: `string`

### userdoc.version

> **version**: `number`

## Source

[solcTypes.ts:403](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L403)
