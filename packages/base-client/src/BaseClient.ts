import type { Logger } from '@tevm/logger'
import type { ReceiptsManager } from '@tevm/receipt-manager'
import type { TxPool } from '@tevm/txpool'
import type { Vm } from '@tevm/vm'
import type { MiningConfig } from './MiningConfig.js'
import type { TevmChain } from '@tevm/chains'

/**
 * The base client used by Tevm. Add extensions to add additional functionality
 */
export type BaseClient<TMode extends 'fork' | 'normal' = 'fork' | 'normal', TExtended = {}> = {
	/**
	 * Returns the chain being used by the client. THis type extends both viem `Chain` and ethereumjs `Common`
	 * This is the same object on `getVm().common`
	 */
	readonly getChain: () => Promise<TevmChain>
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
	 * Fork url if the EVM is forked
	 * @example
	 * ```ts
	 * const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
	 * console.log(client.forkUrl)
	 * ```
	 */
	readonly forkUrl?: string | undefined
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
	 * Extends the base client with additional functionality. This enables optimal code splitting
	 * and extensibility
	 */
	readonly extend: <TExtension extends Record<string, any>>(
		decorator: (client: BaseClient<TMode, TExtended>) => TExtension,
	) => BaseClient<TMode, TExtended & TExtension>
} & TExtended
