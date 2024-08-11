import type { Common } from '@tevm/common'
import { type TevmNodeOptions } from '@tevm/node'
import type { Address } from '@tevm/utils'
import { type Account, type Chain, type ClientConfig, type RpcSchema, type Transport } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
 * Configuration options for creating a {@link MemoryClient}.
 *
 * This type extends `TevmNodeOptions` and includes specific options for configuring the MemoryClient,
 * such as the transport type, account, polling interval, and caching behavior.
 *
 * @template TCommon - The common chain configuration, extending both `Common` and `Chain`.
 * @template TAccountOrAddress - The account or address type for the client.
 * @template TRpcSchema - The RPC schema type, defaults to `TevmRpcSchema`.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, type MemoryClientOptions } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const options: MemoryClientOptions = {
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
 *   },
 *   common: optimism,
 *   name: 'Optimism Memory Client',
 *   pollingInterval: 1000,
 *   cacheTime: 60000,
 * };
 *
 * const client = createMemoryClient(options);
 * ```
 *
 * @see {@link MemoryClient}
 * @see {@link CreateMemoryClientFn}
 *
 * @property {string} [type] - The type of client.
 * @property {string} [key] - The key for the client.
 * @property {string} [name] - The name of the client.
 * @property {TAccountOrAddress} [account] - The account associated with the client.
 * @property {number} [pollingInterval] - The interval (in milliseconds) at which the client polls for new data.
 * @property {number} [cacheTime] - The time (in milliseconds) to cache data.
 * @property {TCommon} [common] - The common chain configuration object.
 * @property {Object} [fork] - The configuration for forking a network.
 * @property {Function} [fork.transport] - The transport function for the fork.
 * @property {string|number} [fork.blockTag] - The specific block tag to fork from.
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
