import type {
	SetAccountJsonRpcRequest,
	SetAccountJsonRpcResponse,
} from '../index.js'

/**
 * SetAccount JSON-RPC tevm procedure sets an account into the tevm state
 */
export type SetAccountJsonRpcProcedure = (
	request: SetAccountJsonRpcRequest,
) => Promise<SetAccountJsonRpcResponse>
