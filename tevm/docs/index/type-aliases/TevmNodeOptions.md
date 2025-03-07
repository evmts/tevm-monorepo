[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmNodeOptions

# Type Alias: TevmNodeOptions\<TCommon\>

> **TevmNodeOptions**\<`TCommon`\>: [`StateOptions`](StateOptions.md) & `object`

Defined in: packages/node/dist/index.d.ts:239

Options for creating an Tevm MemoryClient instance

## Type declaration

### allowUnlimitedContractSize?

> `readonly` `optional` **allowUnlimitedContractSize**: `boolean`

Enable/disable unlimited contract size. Defaults to false.
If set to true you may still run up against block limits

### common?

> `readonly` `optional` **common**: `TCommon`

The common used of the blockchain. Defaults to tevmDevnet. Required for some APIs such as `getEnsAddress` to work. If not specified and a fork is provided the common chainId will be fetched from the fork
Highly recomended you always set this in fork mode as it will speed up client creation via not having to fetch the chain info

#### Example

```
import { optimism } from 'tevm/chains'
import { createMemoryClient } from 'tevm'}

const client = createMemoryClient({ chain: optimism })
````
`

### customPrecompiles?

> `readonly` `optional` **customPrecompiles**: [`CustomPrecompile`](CustomPrecompile.md)[]

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

> `readonly` `optional` **customPredeploys**: `ReadonlyArray`\<[`Predeploy`](Predeploy.md)\<`any`, `any`\>\>

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

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Configure logging options for the client

### miningConfig?

> `readonly` `optional` **miningConfig**: [`MiningConfig`](MiningConfig.md)

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

### persister?

> `readonly` `optional` **persister**: [`SyncStoragePersister`](SyncStoragePersister.md)

The memory client can optionally initialize and persist it's state to an external source like local storage
using `createSyncPersister`

#### Example

```typescript
import { createMemoryClient, createSyncPersister } from 'tevm'

const persister = createSyncPersister({
  storage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
  }
})

const memoryClient = createMemoryClient({ persister })
```

### profiler?

> `readonly` `optional` **profiler**: `boolean`

Enable profiler. Defaults to false.

## Type Parameters

• **TCommon** *extends* [`Common`](../../common/type-aliases/Common.md) = [`Common`](../../common/type-aliases/Common.md)
