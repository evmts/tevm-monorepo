import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'
import type { Hex } from '../common/index.js'

/**
 * Tevm params to execute a call on the vm
 * Call is the lowest level method to interact with the vm
 * and other messages such as contract and script are using call
 * under the hood
 * @example
 * const callParams: import('@tevm/api').CallParams = {
 *   data: '0x...',
 *   bytecode: '0x...',
 *   gasLimit: 420n,
 * }
 */
export type CallParams<TThrowOnFail extends boolean = boolean> = BaseCallParams<TThrowOnFail> & {
	/**
	 * An optional CREATE2 salt.
	 */
	readonly salt?: Hex
	/**
	 * The input data.
	 */
	readonly data?: Hex
	/**
	 * The EVM code to run.
	 */
	readonly deployedBytecode?: Hex
}
