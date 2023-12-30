import type { RunCallAction } from '@tevm/actions'

export type TevmCallRequest = {
	params: RunCallAction
	jsonrpc: '2.0'
	method: 'tevm_call'
	id?: string | number | null
}
