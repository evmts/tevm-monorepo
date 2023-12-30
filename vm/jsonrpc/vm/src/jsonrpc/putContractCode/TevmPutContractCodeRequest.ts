import type { PutContractCodeAction } from '../../actions/putContractCode/PutContractCodeAction.js'

export type TevmPutContractCodeRequest = {
	params: PutContractCodeAction
	jsonrpc: '2.0'
	method: 'tevm_putContractCode'
	id?: string | number | null
}
