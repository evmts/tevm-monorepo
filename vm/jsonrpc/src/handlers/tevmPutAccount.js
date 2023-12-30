import { putAccountHandler } from '@tevm/action-handlers'

/**
 * @param {import('@ethereumjs/evm').EVM} evm
 * @param {import('../requests/index.js').TevmPutAccountRequest} request
 * @returns {Promise<import('../responses/index.js').TevmPutAccountResponse>}
 */
export const tevmPutAccount = async (evm, request) => {
	return {
		jsonrpc: '2.0',
		result: await putAccountHandler(evm, request.params),
		method: 'tevm_putAccount',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
