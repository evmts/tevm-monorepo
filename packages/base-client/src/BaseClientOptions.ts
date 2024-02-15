import type { CustomPrecompile } from './CustomPrecompile.js'
import type { Hardfork } from './Hardfork.js'
import type { CustomPredeploy } from '@tevm/predeploys'
import type { ForkStateManagerOpts, ProxyStateManagerOpts } from '@tevm/state'

/**
 * Options for creating an Tevm MemoryClient instance
 */
export type BaseClientOptions = {
	/**
	 * Optionally set the chainId. Defaults to chainId of fokred/proxied chain or 900
	 */
	chainId?: number
	/**
	 * Enable profiler. Defaults to false.
	 */
	profiler?: boolean
	/**
	 * Hardfork to use. Defaults to `shanghai`
	 */
	hardfork?: Hardfork
	// TODO type this more strongly
	/**
	 * Eips to enable. Defaults to `[1559, 4895]`
	 */
	eips?: ReadonlyArray<number>
	/**
	 * Options to initialize the client in `proxy` mode
	 * When in proxy mode Tevm will fetch all state from the latest block of the provided proxy URL
	 * Cannot be set if `fork` is also set
	 */
	proxy?: ProxyStateManagerOpts
	/**
	 * Fork options fork a live network if enabled.
	 * When in fork mode Tevm will fetch and cache all state from the block forked from the provided URL
	 * Cannot be set if `proxy` is also set
	 */
	fork?: ForkStateManagerOpts
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
