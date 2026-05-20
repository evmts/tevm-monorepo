import { InvalidRequestError } from '@tevm/errors'
import { ReadRequestBodyError } from '../errors/ReadRequestBodyError.js'

const bodySizeErrorMessage = 'Request body exceeds configured max body size'

/**
 * @param {unknown} body
 * @returns {string | InvalidRequestError}
 */
const normalizeBody = (body) => {
	if (typeof body === 'string') {
		return body
	}
	if (Buffer.isBuffer(body)) {
		return body.toString('utf8')
	}
	try {
		const normalizedBody = JSON.stringify(body)
		if (normalizedBody !== undefined) {
			return normalizedBody
		}
	} catch (e) {
		const err = /** @type {Error} */ (e)
		return new InvalidRequestError('Request body must be JSON serializable', { cause: err })
	}
	return new InvalidRequestError('Request body must be a JSON string, Buffer, or JSON-serializable value')
}

/**
 * Gets request body from an http request.
 * @param {import('http').IncomingMessage|{body: unknown}} req The request object
 * @param {{ maxBodySize?: number }} [options] Optional body reading options
 * @returns {Promise<string | ReadRequestBodyError | InvalidRequestError>} Request body as a promise
 * @throws {never} returns errors as value
 */
export const getRequestBody = (req, options = {}) => {
	const { maxBodySize = Number.POSITIVE_INFINITY } = options
	// If the request already has a body property, return it
	if ('body' in req && req.body !== undefined) {
		const body = normalizeBody(req.body)
		if (body instanceof InvalidRequestError) {
			return Promise.resolve(body)
		}
		if (Buffer.byteLength(body, 'utf8') > maxBodySize) {
			return Promise.resolve(new ReadRequestBodyError(bodySizeErrorMessage))
		}
		return Promise.resolve(body)
	}

	// Otherwise, read from the stream
	return new Promise((resolve) => {
		let body = ''
		let done = false

		if ('on' in req) {
			/** @param {string | ReadRequestBodyError} result */
			const finish = (result) => {
				if (done) {
					return
				}
				done = true
				if (typeof req.removeListener === 'function') {
					req.removeListener('error', onError)
					req.removeListener('data', onData)
					req.removeListener('end', onEnd)
				}
				resolve(result)
			}
			/** @param {Error} err */
			const onError = (err) => {
				finish(new ReadRequestBodyError(err.message, { cause: err }))
			}
			/** @param {Buffer | string} chunk */
			const onData = (chunk) => {
				if (done) {
					return
				}
				body += chunk.toString()
				if (Buffer.byteLength(body, 'utf8') > maxBodySize) {
					if (typeof req.pause === 'function') {
						req.pause()
					}
					finish(new ReadRequestBodyError(bodySizeErrorMessage))
				}
			}
			const onEnd = () => {
				finish(body)
			}

			req.on('error', onError)
			req.on('data', onData)
			req.on('end', onEnd)
		} else {
			// Should never happen, but needed for type safety
			resolve(new ReadRequestBodyError('Request object is not a valid stream', {}))
		}
	})
}
