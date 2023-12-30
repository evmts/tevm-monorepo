import type { TevmJsonRpcRequest } from './TevmJsonRpcRequest.js'
import { createJsonRpcClient } from './createJsonRpcClient.js'
import type { EVM } from '@ethereumjs/evm'
import type { IncomingMessage, ServerResponse } from 'http'
import { parse, stringify } from 'superjson'

type CreatehttpHandlerParameters = {
	evm: EVM
	forkUrl?: string
}

/**
 * Creates an http request handler for tevm requests
 */
export function createHttpHandler({
	evm,
	forkUrl,
}: CreatehttpHandlerParameters) {
	const client = createJsonRpcClient(evm)
	return async (req: IncomingMessage, res: ServerResponse) => {
		let body = ''

		req.on('data', (chunk) => {
			body += chunk.toString()
		})

		req.on('end', () => {
			let jsonBody: TevmJsonRpcRequest
			try {
				const raw = JSON.parse(body)
				if (!raw.method.startsWith('tevm_')) {
					if (!forkUrl) {
						res.writeHead(404, { 'Content-Type': 'application/json' })
						const error = {
							id: raw.id,
							method: raw.method,
							jsonrpc: '2.0',
							error: {
								code: 404,
								message: 'Invalid jsonrpc request: Fork url not set',
							},
						}
						res.end(JSON.stringify(error))
						return
					}
					fetch(forkUrl, {
						method: 'POST',
						body: JSON.stringify(raw),
						headers: {
							'Content-Type': 'application/json',
						},
					}).then((response) => {
						res.writeHead(
							response.status,
							Object.fromEntries(response.headers.entries()),
						)
						res.end(response.body)
					})
				}
				jsonBody = { ...raw, params: raw.params && parse(raw.params) }
			} catch (e) {
				res.writeHead(500, { 'Content-Type': 'application/json' })
				const error = {
					id: 'unknown',
					method: 'unknown',
					jsonrpc: '2.0',
					error: {
						code: 500,
						message: 'Invalid jsonrpc request: Unable to parse json',
					},
				}
				res.end(JSON.stringify(error))
				return
			}

			// Verify if it's a valid JSON RPC 2.0 request
			if (jsonBody.jsonrpc !== '2.0') {
				res.writeHead(500, { 'Content-Type': 'application/json' })
				const error = {
					id: 'unknown',
					method: 'unknown',
					jsonrpc: '2.0',
					error: {
						code: 500,
						message: `Invalid jsonrpc request: Invalid schema ${jsonBody.jsonrpc}`,
					},
				}
				res.end(JSON.stringify(error))
				return
			}

			if (
				(jsonBody.method as string) === '' ||
				typeof jsonBody.method !== 'string'
			) {
				res.writeHead(500, { 'Content-Type': 'application/json' })
				const error = {
					id: 'unknown',
					method: 'unknown',
					jsonrpc: '2.0',
					error: {
						code: 500,
						message: 'Invalid jsonrpc request',
					},
				}
				res.end(JSON.stringify(error))
				return
			}

			client(jsonBody)
				.then((result) => {
					try {
						res.writeHead(200, { 'Content-Type': 'application/json' })
						res.end(stringify(result))
						return
					} catch (e) {
						res.writeHead(500, { 'Content-Type': 'application/json' })
						const error = {
							id: jsonBody.id,
							method: jsonBody.method,
							jsonrpc: jsonBody.jsonrpc,
							error: {
								code: 500,
								message: 'Internal server error',
							},
						}
						res.end(JSON.stringify(error))
						return
					}
				})
				.catch((e: Error) => {
					console.error(e)
					res.writeHead(500, { 'Content-Type': 'application/json' })
					const error = {
						id: jsonBody.id,
						method: jsonBody.method,
						jsonrpc: jsonBody.jsonrpc,
						error: {
							code: 404,
							message: `Request method ${jsonBody.method} not supported`,
						},
					}
					res.end(JSON.stringify(error))
					return
				})
		})
	}
}
