import { createHttpHandler } from '../createHttpHandler.js'

/**
 * Creates a Next.js API handler for a Tevm JSON-RPC server
 * @param {{request: import('../createHttpHandler.js').CreateHttpHandlerParameters['request']}} options
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
export const createNextApiHandler = ({ request }) => {
	const handler = createHttpHandler({ request })
	return async (req, res) => {
		handler(req, res)
	}
}
