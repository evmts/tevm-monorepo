import { callHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmCall action for viem.
 * Executes a call against the VM. It is similar to `eth_call` but has more
 * options for controlling the execution environment
 *
 * By default it does not modify the state after the call is complete but this can be configured
 * with the [createTransaction](https://tevm.sh/getting-started/getting-started/) option.
 * @example
 * ```typescript
 * const res = tevm.call({
 *   to: '0x123...',
 *   data: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * }
 * ```
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').CallParams} params
 * @returns {Promise<import('@tevm/actions').CallResult>} The result of the call.
 * Note: this is different from the {@link callHandler} callHandler action which is the same action but for tevm not for viem. Call handler is used internally
 * ```typescript
 * // tevmCall implementation
 * import { callHandler } from '@tevm/actions'
 *
 * export const tevmCall = async (client, params) => {
 * 	 return callHandler(client.transport.tevm)(params)
 * }
 */
export const tevmCall = async (client, params) => {
	return callHandler(client.transport.tevm)(params)
}
