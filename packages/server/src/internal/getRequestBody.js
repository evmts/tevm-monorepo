import { ReadRequestBodyError } from '../errors/ReadRequestBodyError.js'

/**
 * Gets request body from an http request.
 * @param {import('http').IncomingMessage|{body: string}} req The request object
 * @param {{ maxBodySize?: number }} [options] Optional body reading options
 * @returns {Promise<string | ReadRequestBodyError>} Request body as a promise
 * @throws {never} returns errors as value
 */
export const getRequestBody = (req, options = {}) => {
	const { maxBodySize = Number.POSITIVE_INFINITY } = options
	// If the request already has a body property, return it
	if ('body' in req && req.body !== undefined) {
		return Promise.resolve(req.body)
	}

	// Otherwise, read from the stream
	return new Promise((resolve) => {
		let body = ''

		if ('on' in req) {
			req.on('error', (err) => {
				resolve(new ReadRequestBodyError(err.message, { cause: err }))
			})
			req.on('data', (chunk) => {
				body += chunk.toString()
				if (Buffer.byteLength(body, 'utf8') > maxBodySize) {
					resolve(new ReadRequestBodyError('Request body exceeds configured max body size'))
				}
			})

			req.on('end', () => {
				return resolve(body)
			})
		} else {
			// Should never happen, but needed for type safety
			resolve(new ReadRequestBodyError('Request object is not a valid stream', {}))
		}
	})
}
