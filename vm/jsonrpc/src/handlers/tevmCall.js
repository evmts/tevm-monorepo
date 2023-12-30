import { runCallHandler } from '@tevm/action-handlers'

/**
 * @param {import('@ethereumjs/evm').EVM} evm
 * @param {import('../requests/index.js').TevmCallRequest} request
 * @returns {Promise<import('../responses/index.js').TevmCallResponse>}
 */
export const tevmCall = async (evm, request) => {
	return {
		jsonrpc: '2.0',
		result: await runCallHandler(evm, request.params),
		method: 'tevm_call',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
