import { type JsonRpcSchemaTevm } from '@tevm/decorators'
import type { PublicRpcSchema, TestRpcSchema } from 'viem'

export type TevmRpcSchema = [
	...PublicRpcSchema,
	...TestRpcSchema<'anvil' | 'ganache' | 'hardhat'>,
	JsonRpcSchemaTevm['tevm_call'],
	JsonRpcSchemaTevm['tevm_script'],
	JsonRpcSchemaTevm['tevm_dumpState'],
	JsonRpcSchemaTevm['tevm_loadState'],
	JsonRpcSchemaTevm['tevm_getAccount'],
	JsonRpcSchemaTevm['tevm_setAccount'],
]
