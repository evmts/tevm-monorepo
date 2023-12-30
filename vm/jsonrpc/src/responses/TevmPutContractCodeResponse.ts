import type { PutContractCodeResult } from '@tevm/actions'

export type TevmPutContractCodeResponse = {
	jsonrpc: '2.0'
	method: 'tevm_putContractCode'
	result: PutContractCodeResult
	id?: string | number | null
}
