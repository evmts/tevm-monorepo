import { type BaseClientOptions } from '@tevm/base-client'
import { type Account, type Chain, type PublicClientConfig, type RpcSchema, type Transport } from 'viem'
import type { TevmRpcSchema } from './TevmRpcSchema.js'
import type { Address } from '@tevm/utils'
import type { Common } from '@tevm/common'

export type MemoryClientOptions<
	TTransport extends Transport,
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
> = BaseClientOptions<TCommon> &
	Omit<PublicClientConfig<TTransport, TCommon, TAccountOrAddress, TRpcSchema>, 'transport' | 'chain'>
