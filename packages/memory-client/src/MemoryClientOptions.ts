import type { Common } from '@tevm/common'
import type { TevmNodeOptions } from '@tevm/node'
import type { Address } from '@tevm/utils'
import { type Account, type Chain, type ClientConfig, type RpcSchema, type Transport } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
 * Configuration options for {@link createMemoryClient}.
 *
 * Extends {@link TevmNodeOptions} (fork, miningConfig, persister, common, eips, loggingLevel, etc.)
 * with viem client options (type, key, name, account, pollingInterval, cacheTime).
 *
 * @template TCommon - The common chain configuration, extending both `Common` and `Chain`.
 * @template TAccountOrAddress - The account or address type for the client.
 * @template TRpcSchema - The RPC schema type, defaults to `TevmRpcSchema`.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const client = createMemoryClient({
 *   fork: { transport: http("https://mainnet.optimism.io")({}) },
 *   common: optimism,
 *   miningConfig: { type: 'auto' },
 * });
 * ```
 *
 * @see {@link MemoryClient}
 * @see {@link TevmNodeOptions}
 */
export type MemoryClientOptions<
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
> = TevmNodeOptions<TCommon> &
	Pick<
		ClientConfig<Transport, TCommon, TAccountOrAddress, TRpcSchema>,
		'type' | 'key' | 'name' | 'account' | 'pollingInterval' | 'cacheTime'
	> & {
		/**
		 * @deprecated Use miningConfig instead. Interval values are interpreted as milliseconds for compatibility.
		 */
		readonly mining?: {
			readonly auto?: boolean
			readonly interval?: number
		}
	}
