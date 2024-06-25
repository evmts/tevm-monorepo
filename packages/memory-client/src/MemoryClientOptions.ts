import { type BaseClientOptions } from '@tevm/base-client'
import { type Account, type Chain, type ClientConfig, type RpcSchema, type Transport } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'
import type { Address } from '@tevm/utils'
import type { Common } from '@tevm/common'

export type MemoryClientOptions<
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
> = BaseClientOptions<TCommon> &
	Pick<
		ClientConfig<Transport, TCommon, TAccountOrAddress, TRpcSchema>,
		'type' | 'key' | 'name' | 'account' | 'pollingInterval' | 'cacheTime'
	>
