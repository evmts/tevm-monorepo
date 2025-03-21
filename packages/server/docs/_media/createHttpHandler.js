import { tevmSend } from '@tevm/decorators'
import { InternalError, InvalidRequestError, MethodNotFoundError, UnsupportedProviderMethodError } from '@tevm/errors'
import { InvalidJsonError } from './errors/InvalidJsonError.js'
import { ReadRequestBodyError } from './errors/ReadRequestBodyError.js'
import { getRequestBody } from './internal/getRequestBody.js'
import { handleBulkRequest } from './internal/handleBulkRequest.js'
import { handleError } from './internal/handleError.js'
import { parseRequest } from './internal/parseRequest.js'

/**
/**
* Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
* Any unimplemented methods will be proxied to the given proxyUrl
* This handler works for any server that supports the Node.js http module
* @param {import('./Client.js').Client} client
* @returns {import('http').RequestListener}
* @throws {never}
* @example
* import { createHttpHandler } from 'tevm/server'
* import { createTevm } from 'tevm'
* import { createServer } from 'http'
*
* const PORT = 8080
*
* const tevm = createTevm({
*   fork: {
*     transport: http('https://mainnet.optimism.io')({})
*   }
* })
*
* const server = createServer(
*   createHttpHandler(tevm)
* )
* server.listen(PORT, () => console.log({ listening: PORT }))
*
*/
export const createHttpHandler = (client) => {
	/**
	 * @param {import('http').IncomingMessage} req
	 * @param {import('http').ServerResponse} res
	 * @returns {Promise<void>}
	 */
	return async (req, res) => {
		const body = await getRequestBody(req)
		if (body instanceof ReadRequestBodyError) {
			return handleError(client, body, res)
		}

		const parsedRequest = parseRequest(body)
		if (parsedRequest instanceof InvalidJsonError || parsedRequest instanceof InvalidRequestError) {
			return handleError(client, parsedRequest, res)
		}

		if (Array.isArray(parsedRequest)) {
			const responses = await handleBulkRequest(client, /** @type {any}*/ (parsedRequest))
			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify(responses))
			return
		}

		const response = await client.transport.tevm
			.extend(tevmSend())
			.send(/** @type any*/ (parsedRequest))
			.catch((e) => {
				console.log('e', e)
				return 'code' in e ? e : new InternalError('Unexpeced error', { cause: e })
			})

		if ('code' in response && 'message' in response) {
			return handleError(
				client,
				response,
				res,
				/** @type {{method: string, id?: string | number | null}} */ (parsedRequest),
			)
		}
		if (
			response.error?.code === UnsupportedProviderMethodError.code ||
			response.error?.code === MethodNotFoundError.code
		) {
			return handleError(
				client,
				response.error,
				res,
				/** @type {{method: string, id?: string | number | null}} */ (parsedRequest),
			)
		}

		console.log('response', response)
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify(response))
		return
	}
}
