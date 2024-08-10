import { createCommon } from '@tevm/common'
import { requestEip1193, tevmSend } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { createTransport } from 'viem'

/**
 * Creates a custom TEVM Transport for viem.
 *
 * A Transport in viem is the intermediary layer responsible for executing outgoing RPC requests. This custom TEVM Transport integrates an in-memory Ethereum client, making it ideal for local-first applications, optimistic updates, and advanced TEVM functionalities like scripting.
 *
 * @param {import('@tevm/node').TevmNodeOptions} options - Configuration options for the base client, similar to those used in `memoryClient` or a low-level `baseClient`.
 * @returns {import('./TevmTransport.js').TevmTransport} A configured TEVM transport.
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { createTevmTransport } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   const blockNumber = await client.getBlockNumber()
 *   console.log(blockNumber)
 * }
 *
 * example()
 * ```
 *
 * @see {@link createClient}
 * @see [Viem Client Docs](https://viem.sh/docs/clients/introduction)
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [tevm JSON-RPC Guide](https://tevm.sh/learn/json-rpc/)
 * @see [EIP-1193 spec](https://eips.ethereum.org/EIPS/eip-1193)
 * @see [Ethereum jsonrpc docs](https://ethereum.org/en/developers/docs/apis/json-rpc/)
 * @see [CreateMemoryClient Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) - For a batteries-included client if not worried about tree shaking
 *
 * @typedef {Object} TevmTransportConfig
 * @property {number} [timeout=20000] - Timeout duration for requests in milliseconds. Default is 20,000 ms. Supplied by viem.
 * @property {number} [retryCount=3] - The maximum number of times to retry a failed request. Default is 3. Supplied by viem.
 * @property {import('viem').Chain} [chain] - Blockchain configuration. Defaults to the chain specified in `options` or the default TEVM chain.
 *
 * ## Parameters
 *
 * - `timeout` (optional, number): Timeout duration for requests in milliseconds. Default is 20,000 ms. Supplied by viem.
 * - `retryCount` (optional, number): The maximum number of times to retry a failed request. Default is 3. Supplied by viem.
 * - `chain` (optional, Chain): Blockchain configuration. Defaults to the chain specified in `options` or the default TEVM chain if not provided.
 *
 * ## Gotchas
 *
 * - When specifying a chain, use TEVM common instead of viem chains. You can create a TEVM common from a viem chain using `createCommon`.
 */
export const createTevmTransport = (options = {}) => {
	/**
	 * A map to store and manage TEVM clients keyed by chain ID.
	 * @type {Map<number, import('@tevm/node').TevmNode & import('@tevm/decorators').Eip1193RequestProvider & import('@tevm/decorators').TevmSendApi>}
	 */
	const tevmMap = new Map()

	/**
	 * Creates and returns a TEVM transport.
	 * @type {import('./TevmTransport.js').TevmTransport}
	 */
	return ({ timeout = 20_000, retryCount = 3, chain }) => {
		const dynamicChain =
			chain && 'ethjsCommon' in chain
				? /** @type {import('@tevm/common').Common} */ (chain)
				: chain !== undefined
					? // if user passed in chain instead of common create a common from it with cancun and default eips
						createCommon({ ...chain, hardfork: 'cancun', loggingLevel: 'warn' })
					: undefined
		const common = options.common ?? dynamicChain
		const id = common?.id ?? -1
		const tevm =
			tevmMap.get(id) ??
			createTevmNode({ ...options, ...(common !== undefined ? { common } : {}) })
				.extend(requestEip1193())
				.extend(tevmSend())
		tevmMap.set(id, tevm)

		return /** @type {any} */ (
			createTransport(
				{
					request: /** @type any */ (tevm.request),
					type: 'tevm',
					name: /** options?.name ?? */ 'Tevm transport',
					key: /* options?.key ?? */ 'tevm',
					timeout,
					retryCount,
					retryDelay: /* options?.retryDelay ?? */ 150,
				},
				{ tevm },
			)
		)
	}
}
