import { runContractCallHandler } from '@tevm/action-handlers'

/**
 * @type {import("./TevmContractCallGeneric.js").TevmContractCallGeneric}
 */
export const tevmContractCall = async (evm, request) => {
	return {
		jsonrpc: '2.0',
		result: await runContractCallHandler(evm, request.params),
		method: 'tevm_contractCall',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
