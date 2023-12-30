import type { PutContractCodeResponse } from '@tevm/actions'

export type TevmPutContractCodeResponse = {
	jsonrpc: '2.0'
	method: 'tevm_putContractCode'
	result: PutContractCodeResponse
	id?: string | number | null
}
