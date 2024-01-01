import type { CallError, CallParams, CallResult } from '../index.js'
import type { JsonRpcProcedure } from './JsonRpcProcedure.js'

export type CallJsonRpcProcedure = JsonRpcProcedure<
	'tevm_call',
	CallParams,
	CallResult<never>,
	CallError['_tag']
>
