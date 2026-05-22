import type { Common } from '@tevm/common'
import type { Address } from '@tevm/utils'
import { type Account, type Chain, type RpcSchema } from 'viem'
import type { MemoryClient } from './MemoryClient.js'
import type { MemoryClientOptions } from './MemoryClientOptions.js'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

type ForkedMemoryClientOptions<
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
> = Omit<MemoryClientOptions<Common & Chain, TAccountOrAddress, TRpcSchema>, 'common' | 'fork'> & {
	readonly common?: undefined
	readonly fork: NonNullable<MemoryClientOptions<Common & Chain, TAccountOrAddress, TRpcSchema>['fork']>
}

/**
 * Type of {@link createMemoryClient}. When `fork` is supplied without `common`, the chain is inferred
 * from the fork and `TChain` is `undefined`.
 *
 * @template TCommon - The common chain configuration, extending both `Common` and `Chain`.
 * @template TAccountOrAddress - The account or address type for the client.
 * @template TRpcSchema - The RPC schema type, defaults to `TevmRpcSchema`.
 *
 * @see {@link MemoryClient}
 * @see {@link MemoryClientOptions}
 */
export type CreateMemoryClientFn = {
	<
		TAccountOrAddress extends Account | Address | undefined = undefined,
		TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
	>(
		options: ForkedMemoryClientOptions<TAccountOrAddress, TRpcSchema>,
	): MemoryClient<undefined, TAccountOrAddress>
	<
		TCommon extends Common & Chain = Common & Chain,
		TAccountOrAddress extends Account | Address | undefined = undefined,
		TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
	>(
		options?: MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema>,
	): MemoryClient<TCommon, TAccountOrAddress>
}
