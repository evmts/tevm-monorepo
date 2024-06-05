import type { PublicRpcSchema, TestRpcSchema } from 'viem'
import type { EIP1193RequestFn } from '../eip1193/EIP1993RequestFn.js'
import type { JsonRpcSchemaTevm } from '../eip1193/JsonRpcSchemaTevm.js'

// TODO we could refactor this to purely infer the schema from the decorators
// For now we need to keep this in sync with requestProcedure.js

/**
 *
 * The default EIP1193 compatable provider request method with enabled tevm methods.
 */
export type Eip1193RequestProvider = {
	request: EIP1193RequestFn<
		[
			...PublicRpcSchema,
			...TestRpcSchema<'anvil' | 'ganache' | 'hardhat'>,
			JsonRpcSchemaTevm['tevm_call'],
			JsonRpcSchemaTevm['tevm_script'],
			JsonRpcSchemaTevm['tevm_dumpState'],
			JsonRpcSchemaTevm['tevm_loadState'],
			JsonRpcSchemaTevm['tevm_getAccount'],
			JsonRpcSchemaTevm['tevm_setAccount'],
		]
	>
}
