---
editUrl: false
next: false
prev: false
title: "BaseClientOptions"
---

> **BaseClientOptions**: `object`

Options for creating an Tevm MemoryClient instance

## Type declaration

### allowUnlimitedContractSize

> **allowUnlimitedContractSize**?: `boolean`

Enable/disable unlimited contract size. Defaults to false.

### chainId

> **chainId**?: `number`

Optionally set the chainId. Defaults to chainId of fokred/proxied chain or 900

### customPrecompiles

> **customPrecompiles**?: [`CustomPrecompile`](/reference/tevm/base-client/type-aliases/customprecompile/)[]

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

### eips

> **eips**?: `ReadonlyArray`\<`number`\>

Eips to enable. Defaults to `[1559, 4895]`

### fork

> **fork**?: [`ForkStateManagerOpts`](/reference/tevm/state/interfaces/forkstatemanageropts/)

Fork options fork a live network if enabled.
When in fork mode Tevm will fetch and cache all state from the block forked from the provided URL
Cannot be set if `proxy` is also set

### hardfork

> **hardfork**?: [`Hardfork`](/reference/tevm/base-client/type-aliases/hardfork/)

Hardfork to use. Defaults to `shanghai`

### persister

> **persister**?: [`SyncStoragePersister`](/reference/tevm/sync-storage-persister/type-aliases/syncstoragepersister/)

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

const memoryClient = await createMemoryClient({ persister })
```

### profiler

> **profiler**?: `boolean`

Enable profiler. Defaults to false.

### proxy

> **proxy**?: [`ProxyStateManagerOpts`](/reference/tevm/state/interfaces/proxystatemanageropts/)

Options to initialize the client in `proxy` mode
When in proxy mode Tevm will fetch all state from the latest block of the provided proxy URL
Cannot be set if `fork` is also set

## Source

[BaseClientOptions.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/BaseClientOptions.ts#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
