/**
 * JSON-RPC procedure for anvil_setPrevRandao
 * @param {import('@tevm/node').TevmNode} client
 */
export const anvilSetPrevRandaoJsonRpcProcedure =
	(client) =>
	/**
	 * @param {any} request
	 */
	async (request) => {
		const prevRandao = BigInt(request.params[0])
		if (!client.setNextBlockPrevRandao) {
			return {
				method: request.method,
				error: {
					code: '-32000',
					message: 'setPrevRandao is not supported by this node implementation',
				},
				jsonrpc: '2.0',
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
		client.setNextBlockPrevRandao(prevRandao)
		return {
			method: request.method,
			result: null,
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
