import type { PutContractCodeAction } from '@tevm/actions'

export type TevmPutContractCodeRequest = {
	params: PutContractCodeAction
	jsonrpc: '2.0'
	method: 'tevm_putContractCode'
	id?: string | number | null
}
