import { createCommon } from '@tevm/common'
import { requestEip1193, tevmSend } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { createTransport } from 'viem'

/**
 * Creates a custom TEVM Transport for viem clients, backed by an in-memory EVM.
 *
 * Replaces JSON-RPC network calls with direct in-memory EVM execution while remaining
 * EIP-1193 compatible. Internally caches a TEVM node per chain ID so clients on the same
 * chain share state. For a batteries-included client, use {@link createMemoryClient}.
 *
 * @param {import('@tevm/node').TevmNodeOptions} options - Configuration options for the underlying TEVM node.
 * @returns {import('./TevmTransport.js').TevmTransport} A configured TEVM transport factory function.
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { createTevmTransport } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) },
 *   }),
 *   chain: optimism,
 * })
 * await client.transport.tevm.ready()
 * ```
 *
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [EIP-1193 spec](https://eips.ethereum.org/EIPS/eip-1193)
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
						createCommon({ ...chain, hardfork: 'prague', loggingLevel: 'warn' })
					: undefined
		const common = options.common ?? dynamicChain
		const id = options.fork?.chainId ?? common?.id ?? -1
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
