import type { AccountJsonRpcRequest, AccountJsonRpcResponse } from '../index.js'

export type AccountJsonRpcProcedure = (
	request: AccountJsonRpcRequest,
) => Promise<AccountJsonRpcResponse>
