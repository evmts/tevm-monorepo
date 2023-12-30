import type { RunCallResponse } from '@tevm/actions'

export type TevmCallResponse = {
	jsonrpc: '2.0'
	method: 'tevm_call'
	result: RunCallResponse
	id?: string | number | null
}
