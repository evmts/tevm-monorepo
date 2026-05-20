import { tevmSend } from '@tevm/decorators'
import { InternalError, InvalidRequestError, MethodNotFoundError, UnsupportedProviderMethodError } from '@tevm/errors'
import { InvalidJsonError } from './errors/InvalidJsonError.js'
import { ReadRequestBodyError } from './errors/ReadRequestBodyError.js'
import { getRequestBody } from './internal/getRequestBody.js'
import { handleBulkRequest } from './internal/handleBulkRequest.js'
import { handleError } from './internal/handleError.js'
import { parseRequest } from './internal/parseRequest.js'

const DEFAULT_MAX_BODY_SIZE = 1024 * 1024
const DEFAULT_MAX_HEADER_SIZE = 16 * 1024

/**
 * Creates a Node.js http handler for handling JSON-RPC requests with Ethereumjs EVM
 * Any unimplemented methods will be proxied to the given proxyUrl
 * This handler works for any server that supports the Node.js http module
 * @param {import('./Client.js').Client} client
 * @param {{ compatibility?: boolean; maxBodySize?: number; maxHeaderSize?: number }} [options]
 * @returns {import('http').RequestListener}
 * @throws {never}
 * @example
 * ```ts
 * const handler = createHttpHandler(client, {
 *   compatibility: true,
 *   maxBodySize: 1024 * 1024,
 *   maxHeaderSize: 16 * 1024,
 * })
 * ```
 */
export const createHttpHandler = (client, options = {}) => {
	const { compatibility = false, maxBodySize = DEFAULT_MAX_BODY_SIZE, maxHeaderSize = DEFAULT_MAX_HEADER_SIZE } = options

	/** @param {import('http').IncomingMessage} req */
	const getHeaderSize = (req) => {
		if (Array.isArray(req.rawHeaders) && req.rawHeaders.length > 0) {
			return Buffer.byteLength(req.rawHeaders.join('\r\n'), 'utf8')
		}
		return Buffer.byteLength(JSON.stringify(req.headers ?? {}), 'utf8')
	}

	return async (req, res) => {
		if (compatibility) {
			const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
			if (pathname !== '/') return void res.writeHead(404).end()
			if (req.method !== 'POST') return void res.writeHead(405, { Allow: 'POST' }).end()
			if (getHeaderSize(req) > maxHeaderSize) return void res.writeHead(431).end()

			const contentType = req.headers['content-type']
			const parsedContentType = contentType?.split(';')[0]?.trim()?.toLowerCase()
			if (parsedContentType !== 'application/json') {
				return void res.writeHead(415).end()
			}
		}

		const body = await getRequestBody(req, { maxBodySize: compatibility ? maxBodySize : undefined })
		if (body instanceof ReadRequestBodyError) {
			if (compatibility && body.message === 'Request body exceeds configured max body size') return void res.writeHead(413).end()
			return handleError(client, body, res)
		}

		const parsedRequest = parseRequest(body, { allowEmptyBatch: !compatibility })
		if (parsedRequest instanceof InvalidJsonError || parsedRequest instanceof InvalidRequestError) {
			return handleError(client, parsedRequest, res)
		}

		if (Array.isArray(parsedRequest)) {
			const responses = await handleBulkRequest(client, /** @type {any} */ (parsedRequest), {
				suppressNotifications: compatibility,
			})
			if (compatibility && responses.length === 0) return void res.writeHead(204).end()
			res.writeHead(200, { 'Content-Type': 'application/json' })
			return void res.end(JSON.stringify(responses))
		}

		const response = await client.transport.tevm
			.extend(tevmSend())
			.send(/** @type any */ (parsedRequest))
			.catch((e) => ('code' in e ? e : new InternalError('Unexpected error', { cause: e })))

		if (compatibility && parsedRequest.id === undefined) return void res.writeHead(204).end()
		if ('code' in response && 'message' in response) return handleError(client, response, res, parsedRequest)
		if (response.error?.code === UnsupportedProviderMethodError.code || response.error?.code === MethodNotFoundError.code) {
			return handleError(client, response.error, res, parsedRequest)
		}

		res.writeHead(200, { 'Content-Type': 'application/json' })
		return void res.end(JSON.stringify(response))
	}
}
