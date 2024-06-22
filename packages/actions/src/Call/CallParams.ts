import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'
import type { Hex } from '../common/index.js'

/**
 * Tevm params to execute a call on the vm
 * Call is the lowest level method to interact with the vm
 * and other messages such as contract and script are using call
 * under the hood
 * @example
 * ```typescript`
 * const callParams: import('@tevm/api').CallParams = {
 *   data: '0x...',
 *   bytecode: '0x...',
 *   gasLimit: 420n,
 * }
 * ```
 * @see {@link BaseCallParams}
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
	 * The encoded code to deploy with for a deployless call. Code is encoded with constructor args unlike `deployedBytecode`.
	 * @example
	 * ```typescript
	 * import {createMemoryClient, encodeDeployData} from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * await client.tevmCall({
	 *   createTransaction: true,
	 *   data: encodeDeployData({
	 *     bytecode: '0x...',
	 *     data: '0x...',
	 *     abi: [{...}],
	 *     args: [1, 2, 3],
	 *   })
	 * })
	 * ```
	 * Code is also automatically created if using Tevm contracts via script method.
	 *
	 * ```@example
	 * import {SimpleContract} from 'tevm/contracts'
	 * import {createMemoryClient} from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * const script = SimpleContract.script({constructorArgs: [420n]})
	 *
	 * console.log(script.code)
	 *
	 * await client.tevmContract(
	 *   script.read.get() // abi, code, functionName, args
	 * ) // 420n
	 * ```
	 */
	readonly code?: Hex
	/**
	 * The code to put into the state before executing call. If you wish to call the constructor
	 * use `code` instead.
	 * ```@example
	 * import {createMemoryClient} from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * await client.tevmCall({
	 *   data: '0x...',
	 *   deployedBytecode: '0x...',
	 * })
	 * ```
	 */
	readonly deployedBytecode?: Hex
}
