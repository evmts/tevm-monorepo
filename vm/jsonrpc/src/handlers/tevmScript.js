import { runScriptHandler } from '@tevm/action-handlers'

/**
 * @type {import("./TevmScriptGeneric.js").TevmScriptGeneric}
 */
export const tevmScript = async (vm, request) => {
	return {
		jsonrpc: '2.0',
		result: await runScriptHandler(vm, request.params),
		method: 'tevm_script',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
