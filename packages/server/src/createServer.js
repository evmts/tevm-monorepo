import { createHttpHandler } from './createHttpHandler.js'
import { createServer as httpCreateServer } from 'http'

/**
 * Creates a lightweight http server for handling requests
 * @param {Object} options
 * @param {import('http').ServerOptions} [options.serverOptions] - Optional options to pass to the http server
 * @param {import('@tevm/procedures-types').TevmJsonRpcRequestHandler} options.request - A request handler for the JSON-RPC requests
 *
 * To use pass in the Tevm['request'] request handler
 * @example
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 * import { createServer } from 'tevm/server'
 *
 * const tevm = createMemoryClient()
 *
 * const server = createServer({
 *   request: tevm.request,
 * })
 *
 * server.listen(8080, () => console.log('listening on 8080'))
 * ```
 * To interact with the HTTP server you can create a Tevm client
 * @example
 * ```typescript
 * import { createTevmClient } from '@tevm/client'
 *
 * const client = createTevmClient()
 * ```
 */
export const createServer = async ({ request, serverOptions }) => {
	if (serverOptions === undefined) {
		return httpCreateServer(createHttpHandler({ request }))
	}
	return httpCreateServer(serverOptions, createHttpHandler({ request }))
}
