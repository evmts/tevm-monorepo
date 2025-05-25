import type { Common } from '@tevm/common'
import type { TevmNodeOptions } from '@tevm/node'
import type { Address } from '@tevm/utils'
import { type Account, type Chain, type ClientConfig, type RpcSchema, type Transport } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
 * Configuration options for creating a {@link MemoryClient}.
 *
 * This type extends `TevmNodeOptions` and includes specific options for configuring the MemoryClient,
 * such as the transport type, account, polling interval, and caching behavior. It provides
 * a comprehensive set of parameters to customize the behavior of the in-memory Ethereum client.
 *
 * @template TCommon - The common chain configuration, extending both `Common` and `Chain`.
 * @template TAccountOrAddress - The account or address type for the client.
 * @template TRpcSchema - The RPC schema type, defaults to `TevmRpcSchema`.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http, type MemoryClientOptions } from "tevm";
 * import { optimism } from "tevm/common";
 * import { createSyncPersister } from "tevm/sync-storage-persister";
 *
 * const options: MemoryClientOptions = {
 *   // Fork configuration to pull state from a live network
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
 *   },
 *   // Chain configuration
 *   common: optimism,
 *   // Client identification
 *   name: 'Optimism Memory Client',
 *   key: 'optimism-memory',
 *   // Mining configuration (auto mines blocks after transactions)
 *   miningConfig: {
 *     type: 'auto'
 *   },
 *   // Client performance tuning
 *   pollingInterval: 1000,
 *   cacheTime: 60000,
 *   // State persistence
 *   persister: createSyncPersister({
 *     storage: localStorage,
 *     key: 'tevm-state'
 *   }),
 *   // Enable unlimited contract sizes (for testing very large contracts)
 *   allowUnlimitedContractSize: true,
 *   // Logging level
 *   loggingLevel: 'info'
 * };
 *
 * const client = createMemoryClient(options);
 * ```
 *
 * @see {@link MemoryClient}
 * @see {@link CreateMemoryClientFn}
 * @see {@link TevmNodeOptions}
 *
 * @property {string} [type] - The type of client (defaults to 'tevm').
 * @property {string} [key] - The key for the client, used for caching and identification.
 * @property {string} [name] - The name of the client, used for logging and display purposes.
 * @property {TAccountOrAddress} [account] - The account associated with the client for signing transactions.
 * @property {number} [pollingInterval] - The interval (in milliseconds) at which the client polls for new data (for watchable actions).
 * @property {number} [cacheTime] - The time (in milliseconds) to cache data from requests.
 * @property {TCommon} [common] - The common chain configuration object that defines the chain and EVM parameters.
 * @property {Object} [fork] - The configuration for forking a network.
 * @property {Function} [fork.transport] - The transport function for connecting to the fork source network.
 * @property {string|number|bigint} [fork.blockTag] - The specific block tag to fork from (can be number, hash, or named tag like 'latest').
 * @property {Object} [miningConfig] - Configuration for how blocks are mined.
 * @property {'manual'|'auto'|'interval'} [miningConfig.type] - The mining mode (manual requires calling mine(), auto mines after each tx, interval mines on a timer).
 * @property {number} [miningConfig.interval] - For interval mining, how often to mine blocks in milliseconds.
 * @property {import('@tevm/utils').SyncStoragePersister} [persister] - Handler for persisting and restoring state.
 * @property {boolean} [allowUnlimitedContractSize] - Whether to remove the EIP-170 contract size limit (default: false).
 * @property {'error'|'warn'|'info'|'debug'|'trace'} [loggingLevel] - Controls logging verbosity (default: 'info').
 * @property {Object} [eips] - Configuration for specific Ethereum Improvement Proposals.
 * @throws {Error} When configuration options are incompatible or invalid.
 */
export type MemoryClientOptions<
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
> = TevmNodeOptions<TCommon> &
	Pick<
		ClientConfig<Transport, TCommon, TAccountOrAddress, TRpcSchema>,
		'type' | 'key' | 'name' | 'account' | 'pollingInterval' | 'cacheTime'
	>
