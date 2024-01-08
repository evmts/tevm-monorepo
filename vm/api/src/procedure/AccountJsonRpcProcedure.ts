import type { AccountJsonRpcRequest, AccountJsonRpcResponse } from '../index.js'

/**
 * Account JSON-RPC tevm procedure puts an account or contract into the tevm state
 */
export type AccountJsonRpcProcedure = (
	request: AccountJsonRpcRequest,
) => Promise<AccountJsonRpcResponse>
