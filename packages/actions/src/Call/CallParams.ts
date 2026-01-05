import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'
import type { Hex } from '../common/index.js'

/**
 * TEVM parameters to execute a call on the VM.
 * `Call` is the lowest level method to interact with the VM, and other methods such as `contract` and `script` use `call` under the hood.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, tevmCall } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * const client = createMemoryClient({ common: optimism })
 *
 * const callParams = {
 *   data: '0x...',
 *   bytecode: '0x...',
 *   gasLimit: 420n,
 * }
 *
 * await tevmCall(client, callParams)
 * ```
 *
 * @see [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/)
 * @see [tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall/)
 */
export type CallParams<TThrowOnFail extends boolean = boolean> = BaseCallParams<TThrowOnFail> & {
	/**
	 * An optional CREATE2 salt.
	 *
	 * @example
	 * ```typescript
	 * import { createMemoryClient, tevmCall } from 'tevm'
	 * import { optimism } from 'tevm/common'
	 *
	 * const client = createMemoryClient({ common: optimism })
	 *
	 * const callParams = {
	 *   data: '0x...',
	 *   bytecode: '0x...',
	 *   gasLimit: 420n,
	 *   salt: '0x1234...',
	 * }
	 *
	 * await tevmCall(client, callParams)
	 * ```
	 *
	 * @see [CREATE2](https://eips.ethereum.org/EIPS/eip-1014)
	 */
	readonly salt?: Hex
	/**
	 * The input data for the call.
	 */
	readonly data?: Hex
	/**
	 * The encoded code to deploy with for a deployless call. Code is encoded with constructor arguments, unlike `deployedBytecode`.
	 *
	 * @example
	 * ```typescript
	 * import { createMemoryClient, tevmCall, encodeDeployData } from 'tevm'
	 * import { optimism } from 'tevm/common'
	 *
	 * const client = createMemoryClient({ common: optimism })
	 *
	 * const callParams = {
	 *   createTransaction: true,
	 *   data: encodeDeployData({
	 *     bytecode: '0x...',
	 *     data: '0x...',
	 *     abi: [{...}],
	 *     args: [1, 2, 3],
	 *   })
	 * }
	 *
	 * await tevmCall(client, callParams)
	 * ```
	 * Code is also automatically created if using TEVM contracts via the `script` method.
	 *
	 * @example
	 * ```typescript
	 * import { createMemoryClient, tevmContract } from 'tevm'
	 * import { optimism } from 'tevm/common'
	 * import { SimpleContract } from 'tevm/contracts'
	 *
	 * const client = createMemoryClient({ common: optimism })
	 *
	 * const script = SimpleContract.script({ constructorArgs: [420n] })
	 *
	 * await tevmContract(client, script.read.get()) // 420n
	 * ```
	 */
	readonly code?: Hex
	/**
	 * The code to put into the state before executing the call. If you wish to call the constructor, use `code` instead.
	 *
	 * @example
	 * ```typescript
	 * import { createMemoryClient, tevmCall } from 'tevm'
	 * import { optimism } from 'tevm/common'
	 *
	 * const client = createMemoryClient({ common: optimism })
	 *
	 * const callParams = {
	 *   data: '0x...',
	 *   deployedBytecode: '0x...',
	 * }
	 *
	 * await tevmCall(client, callParams)
	 * ```
	 */
	readonly deployedBytecode?: Hex
}
