import { runCallHandler } from '../../actions/runCall/runCallHandler.js'

/**
 * @param {import('../../Tevm.js').Tevm} vm
 * @param {import('./TevmCallRequest.js').TevmCallRequest} request
 * @returns {Promise<import('./TevmCallResponse.js').TevmCallResponse>}
 */
export const tevmCall = async (vm, request) => {
	return {
		jsonrpc: '2.0',
		result: await runCallHandler(vm, request.params),
		method: 'tevm_call',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
