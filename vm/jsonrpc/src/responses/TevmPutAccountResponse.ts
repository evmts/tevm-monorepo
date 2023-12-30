import type { PutAccountResult } from '@tevm/actions'

export type TevmPutAccountResponse = {
	jsonrpc: '2.0'
	method: 'tevm_putAccount'
	result: PutAccountResult
	id?: string | number | null
}
