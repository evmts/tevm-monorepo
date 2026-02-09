import { createCommon } from '@tevm/common'
import { requestEip1193, tevmSend } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { createTransport } from 'viem'

/**
 * Creates a custom TEVM Transport for viem clients, integrating an in-memory Ethereum Virtual Machine.
 *
 * A Transport in viem is the intermediary layer responsible for executing outgoing JSON-RPC requests.
 * The TEVM Transport implementation replaces network requests with direct calls to an in-memory EVM,
 * providing several key advantages:
 *
 * - **Local-first operation**: All EVM execution happens directly in the JavaScript runtime
 * - **Zero network latency**: No round-trips to remote nodes for operations
 * - **Deterministic execution**: Full control over the execution environment for testing
 * - **Advanced tracing**: Step-by-step EVM execution with introspection capabilities
 * - **Forking capabilities**: Can lazily load state from remote networks as needed
 * - **Customizable state**: Direct manipulation of accounts, balances, storage, and more
 *
 * The transport can be used with any viem client (wallet, public, or test) and fully supports the
 * EIP-1193 provider interface, making it compatible with the broader Ethereum ecosystem.
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
 * // Create a client with TEVM transport that forks from Optimism mainnet
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: {
 *       transport: http('https://mainnet.optimism.io')({}),
 *       blockTag: 'latest' // Optional: specify block number or hash
 *     },
 *     mining: {
 *       auto: true,        // Optional: enable auto-mining after transactions
 *       interval: 0        // Optional: mine blocks at regular intervals (ms)
 *     }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   // Ready check ensures fork is initialized
 *   await client.transport.tevm.ready()
 *
 *   const blockNumber = await client.getBlockNumber()
 *   console.log(`Connected to block ${blockNumber}`)
 *
 *   // Access the underlying TEVM node for advanced operations
 *   const node = client.transport.tevm
 *   const vm = await node.getVm()
 *   console.log(`EVM hardfork: ${vm.common.hardfork()}`)
 * }
 *
 * example()
 * ```
 *
 * @see {@link createClient} - Viem function for creating clients
 * @see [Viem Client Docs](https://viem.sh/docs/clients/introduction)
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [tevm JSON-RPC Guide](https://tevm.sh/learn/json-rpc/)
 * @see [EIP-1193 spec](https://eips.ethereum.org/EIPS/eip-1193)
 * @see [Ethereum JSON-RPC docs](https://ethereum.org/en/developers/docs/apis/json-rpc/)
 * @see [CreateMemoryClient Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) - For a batteries-included client if not worried about tree shaking
 *
 * @typedef {Object} TevmTransportConfig
 * @property {number} [timeout=20000] - Timeout duration for requests in milliseconds. Default is 20,000 ms. Supplied by viem.
 * @property {number} [retryCount=3] - The maximum number of times to retry a failed request. Default is 3. Supplied by viem.
 * @property {import('viem').Chain} [chain] - Blockchain configuration. Defaults to the chain specified in `options` or the default TEVM chain.
 *
 * ## Key Transport Options
 *
 * - `timeout` (optional, number): Timeout duration for requests in milliseconds. Default is 20,000 ms.
 * - `retryCount` (optional, number): The maximum number of times to retry a failed request. Default is 3.
 * - `chain` (optional, Chain): Blockchain configuration. Defaults to the chain in `options` or TEVM default.
 *
 * ## Key Node Options
 *
 * - `fork` (optional): Configuration for forking from an existing network
 *   - `transport`: An EIP-1193 compatible transport (e.g., from viem's http function)
 *   - `blockTag` (optional): Block number/hash to fork from (defaults to 'latest')
 * - `mining` (optional): Mining configuration
 *   - `auto` (boolean): Whether to automatically mine after transactions
 *   - `interval` (number): Milliseconds between automatic block mining (0 = disabled)
 * - `common` (optional): Chain configuration (recommended for optimal performance)
 * - `persister` (optional): For state persistence between sessions
 *
 * ## Gotchas and Best Practices
 *
 * - When specifying a chain, use TEVM common instead of viem chains. You can create a TEVM common from a viem chain using `createCommon`.
 * - The transport creates an internal cache of TEVM nodes keyed by chain ID, so multiple clients with the same chain ID share state.
 * - For full control over a client's state, either use unique chain IDs or the higher-level `createMemoryClient`.
 * - Access the underlying TEVM node via `client.transport.tevm` for advanced operations.
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
						createCommon(/** @type {any} */ ({ ...chain, hardfork: 'prague', loggingLevel: 'warn' }))
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
