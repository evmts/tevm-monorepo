import type {
	GetAccountJsonRpcRequest,
	GetAccountJsonRpcResponse,
} from '../index.js'

/**
 * GetAccount JSON-RPC tevm procedure puts an account or contract into the tevm state
 */
export type GetAccountJsonRpcProcedure = (
	request: GetAccountJsonRpcRequest,
) => Promise<GetAccountJsonRpcResponse>
