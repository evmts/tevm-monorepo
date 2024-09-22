[**@tevm/evm**](../README.md) • **Docs**

***

[@tevm/evm](../globals.md) / CreateEvmOptions

# Type Alias: CreateEvmOptions

> **CreateEvmOptions**: `object`

Options for [createEvm](https://tevm.sh/reference/tevm/evm/functions/createevm/)

## Example

```typescript
import { createEvm, CreateEvmOptions } from 'tevm/evm'
import { mainnet } from 'tevm/common'
import { createStateManager } from 'tevm/state'
import { createBlockchain } from 'tevm/blockchain'}
import { EthjsAddress } from 'tevm/utils'

const evm = createEvm({
  common: mainnet.copy(),
  stateManager: createStateManager(),
  blockchain: createBlockchain(),
})

const result = await evm.runCall({
  to: EthjsAddress.fromString(`0x${'0'.repeat(40)}`),
  value: 420n,
  skipBalance: true,
})

console.log(result)
```
The EVM is normally encapsolated by both `@tevm/vm` Vm, TevmNode, and MemoryClient.

## See

 - [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
 - [TevmNode](https://tevm.sh/reference/tevm/node/functions/createbaseclient/)
 - [Vm](https://tevm.sh/reference/tevm/vm/functions/createvm/)

## Type declaration

### allowUnlimitedContractSize?

> `optional` **allowUnlimitedContractSize**: `boolean`

Enable/disable unlimited contract size. Defaults to false.

### blockchain

> **blockchain**: `Chain`

### common

> **common**: `Common`

Ethereumjs common object

### customPrecompiles?

> `optional` **customPrecompiles**: [`CustomPrecompile`](CustomPrecompile.md)[]

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
import { createContract } from '@tevm/contract'
import fs from 'fs/promises'

const Fs = createContract({
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

### customPredeploys?

> `optional` **customPredeploys**: `ReadonlyArray`\<`Predeploy`\<`any`, `any`\>\>

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

### loggingLevel?

> `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

The logging level to run the evm at. Defaults to 'warn'

### profiler?

> `optional` **profiler**: `boolean`

Enable profiler. Defaults to false.

### stateManager

> **stateManager**: `StateManager`

A custom Tevm state manager

## Defined in

[packages/evm/src/CreateEvmOptions.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/CreateEvmOptions.ts#L37)
