import type { PutAccountAction } from '../../actions/putAccount/PutAccountAction.js'

export type TevmPutAccountRequest = {
	params: PutAccountAction
	jsonrpc: '2.0'
	method: 'tevm_putAccount'
	id?: string | number | null
}
