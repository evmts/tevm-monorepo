import { createHttpHandler } from '../createHttpHandler.js'

/**
 * Creates express middleware for a Tevm JSON-RPC server
 * @param {import('../Client.js').Client} client
 * @returns {import('express').RequestHandler}
 * @example
 * ```typescript
 * import express from 'express'
 * import { createExpressMiddleware } from 'tevm/server'
 * import { createMemoryClient } from 'tevm'
 *
 * const tevm = createMemoryClient()
 *
 * const app = express()
 * app.use(express.json())
 * app.use(createExpressMiddleware({ request: tevm.request }))
 * app.listen(8080, () => console.log('listening on 8080'))
 * ```
 *
 * After creating an express server it can be interacted with using any JSON-RPC client
 * including viem, ethers or the built in tevm client
 * ```typescript
 * import { createClient } from 'tevm/client'
 *
 * const client = createClient({
 *  url: 'http://localhost:8080'
 *  })
 *
 *  const blockNumber = await client.eth.getBlockNumber()
 *  const chainId = await client.eth.getChainId()
 *  ```
 */
export function createExpressMiddleware(client) {
	const handler = createHttpHandler(client)
	return async (req, res) => {
		handler(req, res)
	}
}
