import type { AccountError, AccountResult } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type AccountJsonRpcResponse = JsonRpcResponse<
	'tevm_account',
	AccountResult,
	AccountError['_tag']
>
