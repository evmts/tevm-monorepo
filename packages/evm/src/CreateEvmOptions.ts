import type { Chain } from '@tevm/blockchain'
import type { Common } from '@tevm/common'
import type { LogOptions } from '@tevm/logger'
import type { Predeploy } from '@tevm/predeploys'
import type { StateManager } from '@tevm/state'
import type { CustomPrecompile } from './CustomPrecompile.js'

/**
 * Options for [createEvm](https://tevm.sh/reference/tevm/evm/functions/createevm/)
 * @example
 * ```typescript
 * import { createEvm, CreateEvmOptions } from 'tevm/evm'
 * import { mainnet } from 'tevm/common'
 * import { createStateManager } from 'tevm/state'
 * import { createBlockchain } from 'tevm/blockchain'}
 * import { EthjsAddress } from 'tevm/utils'
 *
 * const evm = createEvm({
 *   common: mainnet.copy(),
 *   stateManager: createStateManager(),
 *   blockchain: createBlockchain(),
 * })
 *
 * const result = await evm.runCall({
 *   to: createAddress(`0x${'0'.repeat(40)}`),
 *   value: 420n,
 *   skipBalance: true,
 * })
 *
 * console.log(result)
 * ```
 * The EVM is normally encapsolated by both `@tevm/vm` Vm, TevmNode, and MemoryClient.
 * @see [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
 * @see [TevmNode](https://tevm.sh/reference/tevm/node/functions/createbaseclient/)
 * @see [Vm](https://tevm.sh/reference/tevm/vm/functions/createvm/)
 */
export type CreateEvmOptions = {
	/**
	 * The logging level to run the evm at. Defaults to 'warn'
	 */
	loggingLevel?: LogOptions['level']
	/**
	 * Ethereumjs common object
	 */
	common: Common
	/**
	 * A custom Tevm state manager
	 */
	stateManager: StateManager
	/**
	 * Enable profiler. Defaults to false.
	 */
	profiler?: boolean
	blockchain: Chain
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
	 * import { createContract } from '@tevm/contract'
	 * import fs from 'fs/promises'
	 *
	 * const Fs = createContract({
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
	customPrecompiles?: CustomPrecompile[]
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
	customPredeploys?: ReadonlyArray<Predeploy<any, any>>
	/**
	 * Enable/disable unlimited contract size. Defaults to false.
	 */
	allowUnlimitedContractSize?: boolean
}
