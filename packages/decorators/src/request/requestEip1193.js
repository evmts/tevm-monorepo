import { requestProcedure } from '@tevm/actions'

/**
 * Minimal retry helper to replace viem.withRetry during migration
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{ retryCount?: number, retryDelay?: number }} [options]
 * @returns {Promise<T>}
 */
async function withRetry(fn, options) {
  const max = options?.retryCount ?? 3
  const delay = options?.retryDelay ?? 100
  let attempt = 0
  for (;;) {
    try {
      return await fn()
    } catch (e) {
      attempt++
      if (attempt > max) throw e
      await new Promise((r) => setTimeout(r, delay * attempt))
    }
  }
}

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
	return {
		request: async (args, options) => {
			return withRetry(async () => {
				const result = await requestProcedure(client)(
					/** @type any*/ ({
						jsonrpc: '2.0',
						id: 1,
						method: args.method,
						...(args.params ? { params: args.params } : {}),
					}),
				)
				if (result.error) {
					throw result.error
				}
				return /** @type {any}*/ (result.result)
			}, options)
		},
	}
}
