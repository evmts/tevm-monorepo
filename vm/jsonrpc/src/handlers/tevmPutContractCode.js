import { putContractCodeHandler } from '@tevm/action-handlers'

/**
 * @param {import('@ethereumjs/evm').EVM} evm
 * @param {import('../requests/index.js').TevmPutContractCodeRequest} request
 * @returns {Promise<import('../responses/index.js').TevmPutContractCodeResponse>}
 */
export const tevmPutContractCode = async (evm, request) => {
	return {
		jsonrpc: '2.0',
		result: await putContractCodeHandler(evm, request.params),
		method: 'tevm_putContractCode',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
