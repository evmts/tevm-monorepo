import type { CustomPrecompile } from './CustomPrecompile.js'
import type { TevmBlockchain } from '@tevm/blockchain'
import type { TevmCommon } from '@tevm/common'
import type { CustomPredeploy } from '@tevm/predeploys'
import type { TevmStateManager } from '@tevm/state'

export type CreateEvmOptions = {
	/**
	 * Ethereumjs common object
	 */
	common: TevmCommon
	/**
	 * A custom Tevm state manager
	 */
	stateManager: TevmStateManager
	/**
	 * Enable profiler. Defaults to false.
	 */
	profiler?: boolean
	blockchain: TevmBlockchain
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
	customPredeploys?: ReadonlyArray<CustomPredeploy<any, any>>
	/**
	 * Enable/disable unlimited contract size. Defaults to false.
	 */
	allowUnlimitedContractSize?: boolean
}
