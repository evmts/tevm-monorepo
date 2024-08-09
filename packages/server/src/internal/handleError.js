/**
* @param {{request: (request: {id: number | string, params?: unknown, method: string, jsonrpc: '2.0'}) => unknown} | import('@tevm/memory-client').MemoryClient} client
* @param {import('@tevm/errors').BaseError} error
* @param {import('http').ServerResponse} res
* @param {{method: string, id?: string | undefined | null | number}} [jsonRpcReq]
* @returns {void}
* @throws {never}
*/
export const handleError = (client, error, res, jsonRpcReq = { method: 'unknown' }) => {
const maybeMemoryClient = /** @type {import('@tevm/memory-client').MemoryClient}*/ (client)
maybeMemoryClient?.transport?.tevm?.logger?.error(error)
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
