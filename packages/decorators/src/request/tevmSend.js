// Note: Using dynamic imports to avoid circular dependencies
// The actual handlers are loaded at runtime, not during build
export const importProcedures = async () => {
	const actions = await import('@tevm/actions')
	return {
		requestProcedure: actions.requestProcedure,
		requestBulkProcedure: actions.requestBulkProcedure,
	}
}

/**
 * The low level method for sending and recieving a JSON-RPC request.
 * Strictly adheres to the JSON-RPC 2.0 spec.
 * See `requestEip1193` for a more user friendly method.
 * @returns {import('@tevm/node').Extension<import('./TevmSendApi.js').TevmSendApi>}
 */
export const tevmSend = () => async (client) => {
	const { requestProcedure, requestBulkProcedure } = await importProcedures()
	return {
		send: requestProcedure(client),
		sendBulk: requestBulkProcedure(client),
	}
}
