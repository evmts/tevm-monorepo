import type { PutAccountAction } from '@tevm/actions'

export type TevmPutAccountRequest = {
	params: PutAccountAction
	jsonrpc: '2.0'
	method: 'tevm_putAccount'
	id?: string | number | null
}
