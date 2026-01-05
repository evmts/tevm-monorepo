import type { EIP1193RequestFn } from '../eip1193/EIP1993RequestFn.js'
import type { JsonRpcSchemaTevm } from '../eip1193/JsonRpcSchemaTevm.js'

// TODO we could refactor this to purely infer the schema from the decorators
// For now we need to keep this in sync with requestProcedure.js

/**
 *
 * The default EIP1193 compatable provider request method with enabled tevm methods.
 */
export type Eip1193RequestProvider = {
	// Broad schema for now; will refine to Voltaire schemas as we migrate
	request: EIP1193RequestFn<
		[
			JsonRpcSchemaTevm['tevm_call'],
			JsonRpcSchemaTevm['tevm_dumpState'],
			JsonRpcSchemaTevm['tevm_loadState'],
			JsonRpcSchemaTevm['tevm_getAccount'],
			JsonRpcSchemaTevm['tevm_setAccount'],
		]
	>
}
