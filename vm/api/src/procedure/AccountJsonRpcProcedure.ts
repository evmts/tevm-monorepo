import type { AccountError, AccountParams, AccountResult } from '../index.js'
import type { JsonRpcProcedure } from './JsonRpcProcedure.js'

export type AccountJsonRpcProcedure = JsonRpcProcedure<
	'tevm_account',
	AccountParams,
	AccountResult<never>,
	AccountError['_tag']
>
