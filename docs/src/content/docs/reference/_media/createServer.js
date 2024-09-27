import { createServer as httpCreateServer } from 'node:http'
import { createHttpHandler } from './createHttpHandler.js'

/**
 * Creates a lightweight http server for handling requests
 * @param {import('@tevm/memory-client').MemoryClient} client
 * @param {import('http').ServerOptions} [serverOptions] - Optional options to pass to the http server
 * @returns {import('http').Server}
 * To use pass in the Tevm['request'] request handler
 * @throws {CreateServerError}
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
export const createServer = (client, serverOptions = {}) => {
	return httpCreateServer(serverOptions, createHttpHandler(client))
}
