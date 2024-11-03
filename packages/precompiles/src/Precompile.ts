import type { Contract } from '@tevm/contract'
import type { ExecResult } from '@tevm/evm'
import { type Address, EthjsAddress, type Hex, toHex } from '@tevm/utils'

/**
 * A precompile is a contract that is deployed at a specific address but runs JavaScript code instead of EVM code.
 * It is constructed via a Tevm {@link Contract} and a JavaScript function that implements the precompile.
 * @example
 * ```typescript
 * import { defineCall, definePrecompile } from '@tevm/precompiles'
 * import { Fs } from './Fs.s.sol'
 *
 * // Define a precompile
 * const fsPrecompile = definePrecompile({
 *   contract: Fs.withAddress('0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2'),
 *   call: defineCall(Fs.abi, {
 *     readFile: async ({ args }) => {
 *       return {
 *         returnValue: await fs.readFile(...args, 'utf8'),
 *         executionGasUsed: 0n,
 *       }
 *     }
 *   })
 * })
 * ```
 */
export class Precompile<
	TContract extends Contract<string, ReadonlyArray<string>, Address, any, any> = Contract<
		string,
		ReadonlyArray<string>,
		Address,
		any,
		any
	>,
> {
	constructor(
		/**
		 * Contract interface
		 */
		public readonly contract: TContract,
		public readonly call: (context: {
			data: Hex
			gasLimit: bigint
		}) => Promise<ExecResult>,
	) {}

	protected readonly ethjsAddress = () => createAddress(this.contract.address)

	public readonly precompile = () => ({
		address: this.ethjsAddress(),
		function: (params: { data: Uint8Array; gasLimit: bigint }) => {
			return this.call({ data: toHex(params.data), gasLimit: params.gasLimit })
		},
	})
}
