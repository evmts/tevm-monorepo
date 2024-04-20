// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
// import type { Address } from 'abitype'

import type { DerivedRpcSchema } from './DerivedRpcSchema.js'
import type { EIP1193Parameters } from './EIP1193Parameters.js'
import type { EIP1193RequestOptions } from './EIP1993RequestOptions.js'
import type { RpcSchema } from './RpcSchema.js'
import type { RpcSchemaOverride } from './RpcSchemaOverride.js'

export type EIP1193RequestFn<TRpcSchema extends RpcSchema | undefined = undefined> = <
	TRpcSchemaOverride extends RpcSchemaOverride | undefined = undefined,
	TParameters extends EIP1193Parameters<DerivedRpcSchema<TRpcSchema, TRpcSchemaOverride>> = EIP1193Parameters<
		DerivedRpcSchema<TRpcSchema, TRpcSchemaOverride>
	>,
	_ReturnType = DerivedRpcSchema<TRpcSchema, TRpcSchemaOverride> extends RpcSchema
		? Extract<DerivedRpcSchema<TRpcSchema, TRpcSchemaOverride>[number], { Method: TParameters['method'] }>['ReturnType']
		: unknown,
>(
	args: TParameters,
	options?: EIP1193RequestOptions,
) => Promise<_ReturnType>
