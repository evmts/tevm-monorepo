/**
 * @param {import('@tevm/memory-client').MemoryClient<any, any>} client
 * @param {import('@tevm/errors').BaseError} error
 * @param {import('http').ServerResponse} res
 * @param {{method: string, id?: string | undefined | null | number}} [jsonRpcReq]
 * @returns {void}
 * @throws {never}
 */
export const handleError = (client, error, res, jsonRpcReq = { method: 'unknown' }) => {
	client.tevm.logger.error(error)
	res.writeHead(400, { 'Content-Type': 'application/json' })
	res.end(
		JSON.stringify({
			...(jsonRpcReq.id ? { id: jsonRpcReq.id } : {}),
			method: jsonRpcReq.method,
			jsonrpc: '2.0',
			error: {
				code: error.code,
				message: error.message,
			},
		}),
	)
}
