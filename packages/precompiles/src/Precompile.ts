import { type Script } from '@tevm/contract'
import type { ExecResult } from '@tevm/evm'
import { EthjsAddress, type Hex, toHex } from '@tevm/utils'

/**
 * A precompile is a contract that is deployed at a specific address but runs JavaScript code instead of EVM code.
 * It is constructed via a Tevm {@link Script} and a JavaScript function that implements the precompile.
 * @example
 * import { defineCall, definePrecompile } from '@tevm/precompiles'
 * import { Fs } from './Fs.s.sol'
 *
 * export const fsPrecompile = definePrecompile({
 * 	contract:
 * 		Fs.withAddress(
 * 			`0x${'f2'.repeat(20)}`,
 * 		'),
 * 	call: defineCall(Fs.abi, {
 * 		readFile: async ({ args }) => {
 * 			return {
 * 				returnValue: await fs.readFile(...args, 'utf8'),
 * 				executionGasUsed: 0n,
 * 			}
 * 		},
 * })
 */
export abstract class Precompile<
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TContract extends ReturnType<
		Script<TName, THumanReadableAbi>['withAddress']
	> = ReturnType<Script<TName, THumanReadableAbi>['withAddress']>,
> {
	/**
	 *
	 */
	public abstract readonly contract: TContract
	protected readonly ethjsAddress = () =>
		EthjsAddress.fromString(this.contract.address)
	public readonly precompile = () => ({
		address: this.ethjsAddress(),
		function: (params: { data: Uint8Array; gasLimit: bigint }) => {
			return this.call({ data: toHex(params.data), gasLimit: params.gasLimit })
		},
	})
	public abstract readonly call: (context: {
		data: Hex
		gasLimit: bigint
	}) => Promise<ExecResult>
}
