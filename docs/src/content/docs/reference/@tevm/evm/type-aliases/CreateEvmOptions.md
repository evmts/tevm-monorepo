---
editUrl: false
next: false
prev: false
title: "CreateEvmOptions"
---

> **CreateEvmOptions**: `object`

## Type declaration

### allowUnlimitedContractSize

> **allowUnlimitedContractSize**?: `boolean`

Enable/disable unlimited contract size. Defaults to false.

### blockchain

> **blockchain**: [`TevmBlockchain`](/reference/tevm/blockchain/classes/tevmblockchain/)

### common

> **common**: [`TevmCommon`](/reference/tevm/common/classes/tevmcommon/)

Ethereumjs common object

### customPrecompiles

> **customPrecompiles**?: [`CustomPrecompile`](/reference/tevm/evm/type-aliases/customprecompile/)[]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM.
See the [Precompile guide](https://todo.todo) documentation for a deeper dive
An ever growing standard library of precompiles is provided at `tevm/precompiles`

#### Notice

Not implemented yet [Implementation pr](https://github.com/evmts/tevm-monorepo/pull/728/files)

Below example shows how to make a precompile so you can call `fs.writeFile` and `fs.readFile` in your contracts.
Note: this specific precompile is also provided in the standard library

For security precompiles can only be added statically when the vm is created.

#### Example

```ts
import { createMemoryClient, defineCall, definePrecompile } from 'tevm'
import { createScript } from '@tevm/contract'
import fs from 'fs/promises'

const Fs = createScript({
  name: 'Fs',
  humanReadableAbi: [
    'function readFile(string path) returns (string)',
    'function writeFile(string path, string data) returns (bool)',
  ]
})

const fsPrecompile = definePrecompile({
	contract: Fs,
	address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2',
	call: defineCall(Fs.abi, {
		readFile: async ({ args }) => {
			return {
				returnValue: await fs.readFile(...args, 'utf8'),
				executionGasUsed: 0n,
			}
		},
		writeFile: async ({ args }) => {
			await fs.writeFile(...args)
			return { returnValue: true, executionGasUsed: 0n }
		},
	}),
})

const tevm = createMemoryClient({ customPrecompiles: [fsPrecompile] })

### customPredeploys

> **customPredeploys**?: `ReadonlyArray`\<[`CustomPredeploy`](/reference/tevm/predeploys/type-aliases/custompredeploy/)\<`any`, `any`\>\>

Custom predeploys allow you to deploy arbitrary EVM bytecode to an address.
This is a convenience method and equivalent to calling tevm.setAccount() manually
to set the contract code.
```typescript
const tevm = createMemoryClient({
  customPredeploys: [
    // can pass a `tevm Script` here as well
    {
       address: '0x420420...',
       abi: [...],
       deployedBytecode: '0x420420...',
    }
  ],
})
```

### profiler

> **profiler**?: `boolean`

Enable profiler. Defaults to false.

### stateManager

> **stateManager**: [`TevmStateManager`](/reference/tevm/state/type-aliases/tevmstatemanager/)

A custom Tevm state manager

## Source

[packages/evm/src/CreateEvmOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/CreateEvmOptions.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
