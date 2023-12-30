import { putAccountHandler } from '../../actions/putAccount/putAccountHandler.js'

/**
 * @param {import('../../Tevm.js').Tevm} vm
 * @param {import('./TevmPutAccountRequest.js').TevmPutAccountRequest} request
 * @returns {Promise<import('./TevmPutAccountResponse.js').TevmPutAccountResponse>}
 */
export const tevmPutAccount = async (vm, request) => {
	return {
		jsonrpc: '2.0',
		result: await putAccountHandler(vm, request.params),
		method: 'tevm_putAccount',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
