import type { BaseCallParams } from './BaseCallParams.js'
import { type Hex } from 'viem'

/**
 * Tevm action to execute a call on the vm
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
export type CallParams = BaseCallParams & {
	/**
	 * An optional CREATE2 salt.
	 */
	salt?: Hex
	/**
	 * The input data.
	 */
	data?: Hex
	/**
	 * The EVM code to run.
	 */
	deployedBytecode?: Hex
}
