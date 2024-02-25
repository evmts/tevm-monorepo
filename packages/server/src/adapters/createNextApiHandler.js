import { createHttpHandler } from '../createHttpHandler.js'

/**
 * Creates a Next.js API handler for a Tevm JSON-RPC server
 * @param {Pick<import('@tevm/memory-client').MemoryClient, 'send'>} client
 * @returns {import('next').NextApiHandler}
 * @example
 * ```typescript
 * import { createNextApiHandler } from 'tevm/server'
 * import { createMemoryClient } from 'tevm'
 *
 * const tevm = createMemoryClient()
 * export default createNextApiHandler({ request: tevm.request })
 * ```
 */
export const createNextApiHandler = (client) => {
	const handler = createHttpHandler(client)
	return async (req, res) => {
		handler(req, res)
	}
}
