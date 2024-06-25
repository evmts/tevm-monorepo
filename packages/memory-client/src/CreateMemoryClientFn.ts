import type { Address } from '@tevm/utils'
import type { MemoryClientOptions } from './MemoryClientOptions.js'
import { type Account, type Chain, type RpcSchema } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'
import type { MemoryClient } from './MemoryClient.js'
import type { Common } from '@tevm/common'

export type CreateMemoryClientFn = <
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
>(
	options?: MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema>,
) => MemoryClient<TCommon, TAccountOrAddress>
