import type { TevmJsonRpcRequest } from './TevmJsonRpcRequest.js'
import { createJsonRpcClient } from './createJsonRpcClient.js'
import type { TevmCallResponse } from './index.js'
import type { EVM } from '@ethereumjs/evm'
import type { PutAccountResponse } from '@tevm/actions'
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

	const handleErrorResponse = (
		res: ServerResponse,
		id: string,
		method: string,
		code: number,
		message: string,
	) => {
		res.writeHead(code, { 'Content-Type': 'application/json' })
		const errorResponse = {
			id,
			method,
			jsonrpc: '2.0',
			error: {
				code,
				message,
			},
		}
		res.end(JSON.stringify(errorResponse))
	}

	const processRequest = async (request: TevmJsonRpcRequest) => {
		if (!request.method.startsWith('tevm_')) {
			if (!forkUrl) {
				return {
					id: request.id,
					method: request.method,
					jsonrpc: '2.0',
					error: {
						code: 404,
						message: 'Invalid jsonrpc request: Fork url not set',
					},
				}
			}

			// TODO there is no error handling here
			const response = await fetch(forkUrl, {
				method: 'POST',
				body: JSON.stringify(request),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((res) => res.json())

			return {
				id: request.id,
				...(response as object),
			}
		}

		const parsedRequest = {
			...request,
			params: request.params && parse(JSON.stringify(request.params)),
		}

		// Verify if it's a valid JSON RPC 2.0 request
		if (parsedRequest.jsonrpc !== '2.0') {
			return {
				id: parsedRequest.id,
				method: parsedRequest.method,
				jsonrpc: '2.0',
				error: {
					code: 500,
					message: `Invalid jsonrpc request: Invalid schema ${parsedRequest.jsonrpc}`,
				},
			}
		}

		if (
			(parsedRequest.method as any) === '' ||
			typeof parsedRequest.method !== 'string'
		) {
			return {
				id: parsedRequest.id,
				method: parsedRequest.method,
				jsonrpc: '2.0',
				error: {
					code: 500,
					message: 'Invalid jsonrpc request',
				},
			}
		}

		try {
			const result = await client(parsedRequest as any)
			// TODO superjson for some reason cannot serialize a putAccount request
			if (parsedRequest.method === 'tevm_putAccount') {
				return {
					id: parsedRequest.id,
					...result,
					result: JSON.parse(
						stringify({
							nonce: (result.result as PutAccountResponse).nonce,
							balance: (result.result as PutAccountResponse).balance,
							// if we include the uint8array fields codehash and stateRoot this entire thing fails
							// codehash: result.result.codehash,
							// stateRoot: result.result.stateRoot,
						}),
					),
				}
			}
			// TODO superjson for some reason cannot serialize a call request
			if (parsedRequest.method === 'tevm_call') {
				// later we will make it so all uint8arrays are hex in tevm natively since this is causing so many issues
				function uint8ArrayToHex(uint8Array: Uint8Array) {
					let hexStr = '0x'
					for (let i = 0; i < uint8Array.length; i++) {
						const nextItem = uint8Array[i] as number
						const hex = nextItem.toString(16)
						hexStr += hex.length === 1 ? `0${hex}` : hex
					}
					return hexStr
				}
				const tevmCallResult = result as TevmCallResponse
				return {
					id: parsedRequest.id,
					...result,
					result: JSON.parse(
						stringify({
							execResult: {
								returnValue: uint8ArrayToHex(
									tevmCallResult.result.execResult.returnValue,
								),
								gas: tevmCallResult.result.execResult.gas,
								logs: tevmCallResult.result.execResult.logs,
								// TODO lazily not including all fields since this code is temporary
							},
						}),
					),
				}
			}
			return {
				id: parsedRequest.id,
				...result,
				result: JSON.parse(stringify(result.result)),
			}
		} catch (e) {
			console.error(e)
			return {
				id: parsedRequest.id,
				method: parsedRequest.method,
				jsonrpc: parsedRequest.jsonrpc,
				error: {
					code: 500,
					message: 'Internal server error',
				},
			}
		}
	}

	return async (req: IncomingMessage, res: ServerResponse) => {
		let body = ''

		req.on('data', (chunk) => {
			body += chunk.toString()
		})

		req.on('end', async () => {
			try {
				const raw = JSON.parse(body)

				if (Array.isArray(raw)) {
					const responses = await Promise.all(raw.map(processRequest))
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(responses))
				} else {
					const response = await processRequest(raw)
					res.writeHead(200, { 'Content-Type': 'application/json' })
					res.end(JSON.stringify(response))
				}
			} catch (e) {
				console.error(e)
				handleErrorResponse(
					res,
					'unknown',
					'unknown',
					500,
					'Invalid jsonrpc request: Unable to parse json',
				)
			}
		})
	}
}
