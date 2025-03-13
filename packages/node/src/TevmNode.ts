import type { Logger } from '@tevm/logger'
import type { ReceiptsManager } from '@tevm/receipt-manager'
import type { TxPool } from '@tevm/txpool'
import type { Address, Hex } from '@tevm/utils'
import type { Vm } from '@tevm/vm'
import type { EIP1193RequestFn } from 'viem'
import type { EIP1193EventEmitter } from './EIP1193EventEmitterTypes.js'
import type { Filter } from './Filter.js'
import type { MiningConfig } from './MiningConfig.js'

/**
 * The base client used by Tevm. Add extensions to add additional functionality
 */
export type TevmNode<TMode extends 'fork' | 'normal' = 'fork' | 'normal', TExtended = {}> = {
	/**
	 * The logger instance
	 */
	readonly logger: Logger
	/**
	 * Interface for querying receipts and historical state
	 */
	readonly getReceiptsManager: () => Promise<ReceiptsManager>
	/**
	 * The configuration for mining. Defaults to 'auto'
	 * - 'auto' will mine a block on every transaction
	 * - 'interval' will mine a block every `interval` milliseconds
	 * - 'manual' will not mine a block automatically and requires a manual call to `mineBlock`
	 */
	readonly miningConfig: MiningConfig
	/**
	 * Client to make json rpc requests to a forked node
	 * @example
	 * ```ts
	 * const client = createMemoryClient({ request: eip1193RequestFn })
	 * ```
	 */
	readonly forkTransport?: {
		request: EIP1193RequestFn
	}
	/**
	 * The mode the current client is running in
	 * `fork` mode will fetch and cache all state from the block forked from the provided URL
	 * `normal` mode will not fetch any state and will only run the EVM in memory
	 * @example
	 * ```ts
	 * let client = createMemoryClient()
	 * console.log(client.mode) // 'normal'
	 * client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
	 * console.log(client.mode) // 'fork'
	 * ```
	 */
	readonly mode: TMode
	/**
	 * Returns promise that resulves when the client is ready
	 * The client is usable without calling this method but may
	 * have extra latency on the first call from initialization
	 * @example
	 * ```ts
	 * const client = createMemoryClient()
	 * await client.ready()
	 * ```
	 */
	readonly ready: () => Promise<true>
	/**
	 * Internal instance of the VM. Can be used for lower level operations.
	 * Normally not recomended to use unless building libraries or extensions
	 * on top of Tevm.
	 */
	readonly getVm: () => Promise<Vm>
	/**
	 * Gets the pool of pending transactions to be included in next block
	 */
	readonly getTxPool: () => Promise<TxPool>
	/**
	 * The currently impersonated account. This is only used in `fork` mode
	 */
	readonly getImpersonatedAccount: () => Address | undefined
	/**
	 * Sets the account to impersonate. This will allow the client to act as if it is that account
	 * On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating
	 */
	readonly setImpersonatedAccount: (address: Address | undefined) => void
	/**
	 * Extends the base client with additional functionality. This enables optimal code splitting
	 * and extensibility
	 */
	readonly extend: <TExtension extends Record<string, any>>(
		decorator: (client: TevmNode<TMode, TExtended>) => TExtension,
	) => TevmNode<TMode, TExtended & TExtension>
	/**
	 * Creates a new filter to watch for logs events and blocks
	 */
	readonly setFilter: (filter: Filter) => void
	/**
	 * Gets all registered filters mapped by id
	 */
	readonly getFilters: () => Map<Hex, Filter>
	/**
	 * Removes a filter by id
	 */
	readonly removeFilter: (id: Hex) => void
	/**
	 * Returns status of the client
	 * - INITIALIZING: The client is initializing
	 * - READY: The client is ready to be used
	 * - SYNCING: The client is syncing with the forked node
	 * - MINING: The client is mining a block
	 */
	status: 'INITIALIZING' | 'READY' | 'SYNCING' | 'MINING' | 'STOPPED'
	/**
	 * Copies the current client state into a new client
	 */
	readonly deepCopy: () => Promise<TevmNode<TMode, TExtended>>
	/**
	 * Clean up resources used by the client.
	 * This should be called when the client is no longer needed to prevent memory leaks.
	 * It cleans up resources like interval timers for mining.
	 */
	readonly cleanup: () => void
} & EIP1193EventEmitter &
	TExtended
