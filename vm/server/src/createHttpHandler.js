import { BadRequestError } from './BadRequestError.js'
import { UnexpectedInternalServerError } from './UnexpectedInternalServerError.js'
import { processRequest } from './processRequest.js'
import { zJsonRpcRequest } from '@tevm/zod'

/**
 * @typedef {{evm: import('@ethereumjs/evm').EVM, proxyUrl?: string}} CreateHttpHandlerParameters
 */

/**
 * Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
 * Any unimplemented methods will be proxied to the given proxyUrl
 * This handler works for any server that supports the Node.js http module
 * @param {CreateHttpHandlerParameters} parameters
 * @returns {import('http').RequestListener}
 * @example
 * import { createHttpHandler } from '@tevm/http'
 * import { Tevm } from '@tevm/vm'
 * import { createServer } from 'http'
 *
 * const PORT = 8080
 *
 * const vm = new Tevm({
 *   fork: {
 *     url: 'https://mainnet.optimism.io'
 *   }
 * })
 *
 * const server = createServer(
 *   createHttpHandler({
 *     evm: vm,
 *     proxyUrl: 'https://mainnet.optimism.io'
 *   })
 * )
 * server.listen(PORT, () => console.log({ listening: PORT }))
 *
 */
export const createHttpHandler = ({ evm, proxyUrl }) => {
	/**
	 * @param {import('http').IncomingMessage} req
	 * @param {import('http').ServerResponse} res
	 * @returns {void}
	 */
	return (req, res) => {
		let body = ''

		req.on('data', (chunk) => {
			body += chunk.toString()
		})

		req.on('end', async () => {
			/**
			 * @type {unknown}
			 */
			let raw
			try {
				raw = JSON.parse(body)
			} catch (e) {
				console.error(e)
				const err = new BadRequestError('Request body is not valid json')
				res.writeHead(400, { 'Content-Type': 'application/json' })
				res.end(
					JSON.stringify({
						id: 'unknown',
						method: 'unknown',
						jsonrpc: '2.0',
						error: {
							code: err._tag,
							message: err.message,
						},
					}),
				)
				return
			}
			const parsedRequest = zJsonRpcRequest.safeParse(raw)
			if (!parsedRequest.success) {
				const err = new BadRequestError(
					JSON.stringify(parsedRequest.error.format()),
				)
				res.writeHead(400, { 'Content-Type': 'application/json' })
				res.end(
					JSON.stringify({
						id: 'unknown',
						method: 'unknown',
						jsonrpc: '2.0',
						error: {
							code: err._tag,
							message: err.message,
						},
					}),
				)
				return
			}

			if (Array.isArray(parsedRequest.data)) {
				/**
				 * @type {ReadonlyArray<import("@tevm/api").JsonRpcRequest<string, object>>}
				 */
				const requests = parsedRequest.data
				const responses = await Promise.allSettled(
					requests.map(processRequest(evm, proxyUrl)),
				)
				responses.map((response, i) => {
					const request =
						/** @type {import("@tevm/api").JsonRpcRequest<string, object>} */ (
							requests[i]
						)
					if (response.status === 'rejected') {
						console.error(response.reason)
						const err = new UnexpectedInternalServerError(request.method)
						return {
							id: request.id,
							method: request.method,
							jsonrpc: '2.0',
							error: {
								code: err._tag,
								message: err.message,
							},
						}
					}
					return response.value
				})
				res.writeHead(200, { 'Content-Type': 'application/json' })
				return res.end(JSON.stringify(responses))
			} else {
				const request =
					/**  @type {import("@tevm/api").JsonRpcRequest<string, object>} */ (
						parsedRequest.data
					)
				try {
					const response = await processRequest(evm, proxyUrl)(request)
					res.writeHead(200, { 'Content-Type': 'application/json' })
					return res.end(JSON.stringify(response))
				} catch (e) {
					console.error(e)
					const err = new UnexpectedInternalServerError(request.method)
					console.error(err)
					const response = {
						id: request.id,
						method: request.method,
						jsonrpc: '2.0',
						error: {
							code: err._tag,
							message: err.message,
						},
					}
					res.writeHead(500, { 'Content-Type': 'application/json' })
					return res.end(JSON.stringify(response))
				}
			}
		})
	}
}
