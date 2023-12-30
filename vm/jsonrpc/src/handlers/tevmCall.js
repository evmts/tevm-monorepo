import { runCallHandler } from '@tevm/actions'

/**
 * @param {import('../../Tevm.js').Tevm} vm
 * @param {import('../requests/index.js').TevmCallRequest} request
 * @returns {Promise<import('../responses/index.js').TevmCallResponse>}
 */
export const tevmCall = async (vm, request) => {
	return {
		jsonrpc: '2.0',
		result: await runCallHandler(vm, request.params),
		method: 'tevm_call',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
