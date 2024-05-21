import type { TevmChain } from '@tevm/chains'
import { type CustomCrypto } from '@tevm/common'
import type { LogOptions } from '@tevm/logger'
import type { CustomPredeploy } from '@tevm/predeploys'
import type { StateOptions } from '@tevm/state'
import type { SyncStoragePersister } from '@tevm/sync-storage-persister'
import type { CustomPrecompile } from './CustomPrecompile.js'
import type { Hardfork } from './Hardfork.js'
import type { MiningConfig } from './MiningConfig.js'

/**
 * Options for creating an Tevm MemoryClient instance
 */
export type BaseClientOptions = StateOptions & {
	/**
	 * The chain of the blockchain. Defaults to tevmDevnet. Required for some APIs such as `getEnsAddress` to work.
	 * Highly recomended you always set this in fork mode as it will speed up client creation via not having to fetch the chain info
	 * @example
	 * ```
	 * import { optimism } from 'tevm/chains'
	 * import { createMemoryClient } from 'tevm'}
	 *
	 * const client = createMemoryClient({ chain: optimism })
	 * ````
	 * `
	 */
	readonly chain?: TevmChain
	/**
	 * Custom crypto functionality provided to the evm. For 4844 support kzt must be passed
	 */
	readonly customCrypto?: CustomCrypto
	/**
	 * Configure logging options for the client
	 */
	readonly loggingLevel?: LogOptions['level']
	/**
	 * The configuration for mining. Defaults to 'auto'
	 * - 'auto' will mine a block on every transaction
	 * - 'interval' will mine a block every `interval` milliseconds
	 * - 'manual' will not mine a block automatically and requires a manual call to `mineBlock`
	 */
	readonly miningConfig?: MiningConfig
	/**
	 * Enable profiler. Defaults to false.
	 */
	readonly profiler?: boolean
	/**
	 * Hardfork to use. Defaults to `shanghai`
	 */
	readonly hardfork?: Hardfork
	// TODO type this more strongly
	/**
	 * Eips to enable. Defaults to `[1559, 4895]`
	 */
	readonly eips?: ReadonlyArray<number>
	/**
	 * Custom precompiles allow you to run arbitrary JavaScript code in the EVM.
	 * See the [Precompile guide](https://todo.todo) documentation for a deeper dive
	 * An ever growing standard library of precompiles is provided at `tevm/precompiles`
	 * @notice Not implemented yet {@link https://github.com/evmts/tevm-monorepo/pull/728/files | Implementation pr }
	 *
	 * Below example shows how to make a precompile so you can call `fs.writeFile` and `fs.readFile` in your contracts.
	 * Note: this specific precompile is also provided in the standard library
	 *
	 * For security precompiles can only be added statically when the vm is created.
	 * @example
	 * ```ts
	 * import { createMemoryClient, defineCall, definePrecompile } from 'tevm'
	 * import { createScript } from '@tevm/contract'
	 * import fs from 'fs/promises'
	 *
	 * const Fs = createScript({
	 *   name: 'Fs',
	 *   humanReadableAbi: [
	 *     'function readFile(string path) returns (string)',
	 *     'function writeFile(string path, string data) returns (bool)',
	 *   ]
	 * })
	 *
	 * const fsPrecompile = definePrecompile({
	 * 	contract: Fs,
	 * 	address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2',
	 * 	call: defineCall(Fs.abi, {
	 * 		readFile: async ({ args }) => {
	 * 			return {
	 * 				returnValue: await fs.readFile(...args, 'utf8'),
	 * 				executionGasUsed: 0n,
	 * 			}
	 * 		},
	 * 		writeFile: async ({ args }) => {
	 * 			await fs.writeFile(...args)
	 * 			return { returnValue: true, executionGasUsed: 0n }
	 * 		},
	 * 	}),
	 * })
	 *
	 * const tevm = createMemoryClient({ customPrecompiles: [fsPrecompile] })
	 */
	readonly customPrecompiles?: CustomPrecompile[]
	/**
	 * Custom predeploys allow you to deploy arbitrary EVM bytecode to an address.
	 * This is a convenience method and equivalent to calling tevm.setAccount() manually
	 * to set the contract code.
	 * ```typescript
	 * const tevm = createMemoryClient({
	 *   customPredeploys: [
	 *     // can pass a `tevm Script` here as well
	 *     {
	 *        address: '0x420420...',
	 *        abi: [...],
	 *        deployedBytecode: '0x420420...',
	 *     }
	 *   ],
	 * })
	 * ```
	 */
	readonly customPredeploys?: ReadonlyArray<CustomPredeploy<any, any>>
	/**
	 * Enable/disable unlimited contract size. Defaults to false.
	 */
	readonly allowUnlimitedContractSize?: boolean
	/**
	 * The memory client can optionally initialize and persist it's state to an external source like local storage
	 * using `createSyncPersister`
	 * @example
	 * ```typescript
	 * import { createMemoryClient, createSyncPersister } from 'tevm'
	 *
	 * const persister = createSyncPersister({
	 *   storage: {
	 *     getItem: (key: string) => localStorage.getItem(key),
	 *     setItem: (key: string, value: string) => localStorage.setItem(key, value),
	 *   }
	 * })
	 *
	 * const memoryClient = createMemoryClient({ persister })
	 * ```
	 */
	readonly persister?: SyncStoragePersister
}
