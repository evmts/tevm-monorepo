import { stringToHex } from '@tevm/utils'

/**
 * Request handler for eth_protocolVersion JSON-RPC requests.
 * @returns {import('./EthProcedure.js').EthProtocolVersionJsonRpcProcedure}
 */
export const ethProtocolVersionJsonRpcProcedure = () => {
	return async (request) => {
		return {
			result: stringToHex('tevm@1.x.x'),
			jsonrpc: '2.0',
			method: 'eth_protocolVersion',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
