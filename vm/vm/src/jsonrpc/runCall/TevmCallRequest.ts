import type { RunCallAction } from '../../actions/runCall/RunCallAction.js'

export type TevmCallRequest = {
	params: RunCallAction
	jsonrpc: '2.0'
	method: 'tevm_call'
	id?: string | number | null
}
