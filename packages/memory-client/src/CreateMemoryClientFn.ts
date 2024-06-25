import type { Address } from '@tevm/utils'
import type { MemoryClientOptions } from './MemoryClientOptions.js'
import { type Account, type Chain, type RpcSchema, type Transport } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'
import type { MemoryClient } from './MemoryClient.js'
import type { Common } from '@tevm/common'

export type CreateMemoryClientFn = <
	TTransport extends Transport,
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
>(
	options: MemoryClientOptions<TTransport, TCommon, TAccountOrAddress, TRpcSchema>,
) => MemoryClient<TTransport, TCommon, TAccountOrAddress>
