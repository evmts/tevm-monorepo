import type { PutAccountResponse } from '@tevm/actions'

export type TevmPutAccountResponse = {
	jsonrpc: '2.0'
	method: 'tevm_putAccount'
	result: PutAccountResponse
	id?: string | number | null
}
