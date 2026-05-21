import { requestProcedure } from '@tevm/actions'
import { ProviderRpcError } from '@tevm/node'

// TODO we want to split up these requests into seperate decorators and
// have typescript correctly merge the schemas as they go
// Skipping for now because it isn't necessary for the current use case
// of `memoryClient` and `httpClient` being the only provider implementations used
// with default decorators. We do eventually want to move away from that pattern
// towards a pattern of always decorating a base client with a set of decorators
// Probabally a v 2.0 thing though

/**
 * A decorator that adds the EIP-1193 request method to the client
 * @returns {import('@tevm/node').Extension<import('./Eip1193RequestProvider.js').Eip1193RequestProvider>}
 */
export const requestEip1193 = () => (client) => {
	const handleRequest = requestProcedure(client)
	return {
		request: async (args) => {
			const result = await handleRequest(
				/** @type any*/ ({
					jsonrpc: '2.0',
					id: 1,
					method: args.method,
					...(args.params ? { params: args.params } : {}),
				}),
			)
			if (result.error) {
				const error = typeof result.error === 'object' && result.error !== null ? result.error : {}
				const code = typeof error.code === 'number' ? error.code : Number(error.code)
				throw new ProviderRpcError(
					Number.isFinite(code) ? code : -32000,
					typeof error.message === 'string' ? error.message : 'Unknown provider error',
					'data' in error ? error.data : result.error,
				)
			}
			return /** @type {any}*/ (result.result)
		},
	}
}
