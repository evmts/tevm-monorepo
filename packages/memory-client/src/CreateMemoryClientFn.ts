import type { Common } from '@tevm/common'
import type { Address } from '@tevm/utils'
import { type Account, type Chain, type RpcSchema } from 'viem'
import type { MemoryClient } from './MemoryClient.js'
import type { MemoryClientOptions } from './MemoryClientOptions.js'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
 * Type definition for the function that creates a {@link MemoryClient}.
 * This function initializes a MemoryClient with the provided options,
 * including forking configurations, logging levels, and state persistence options.
 *
 * @template TCommon - The common chain configuration, extending both `Common` and `Chain`.
 * @template TAccountOrAddress - The account or address type for the client.
 * @template TRpcSchema - The RPC schema type, defaults to `TevmRpcSchema`.
 *
 * @param {MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema>} [options] - The options to configure the MemoryClient.
 * @returns {MemoryClient<TCommon, TAccountOrAddress>} - A configured MemoryClient instance.
 *
 * @example
 * ```typescript
 * import { createMemoryClient } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const client = createMemoryClient({
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
 *   },
 *   common: optimism,
 * });
 * ```
 *
 * @see For more details on using the MemoryClient, refer to {@link MemoryClient}.
 */
export type CreateMemoryClientFn = <
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
>(
	options?: MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema>,
) => MemoryClient<TCommon, TAccountOrAddress>
