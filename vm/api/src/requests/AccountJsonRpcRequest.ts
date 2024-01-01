import type { AccountParams } from '../index.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

export type AccountJsonRpcRequest = JsonRpcRequest<
	'tevm_account',
	AccountParams
>
