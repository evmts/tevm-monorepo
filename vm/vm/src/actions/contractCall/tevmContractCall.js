import { runContractCallHandler } from "./runContractCallHandler.js"

/**
 * @type {import("./TevmContractCallGeneric.js").TevmContractCallGeneric}
 */
export const tevmContractCall = async (vm, request) => {
	return {
		jsonrpc: '2.0',
		result: await runContractCallHandler(vm, request.params),
		method: 'tevm_contractCall',
		...(request.id === undefined ? {} : { id: request.id })
	}
}

