import { ReadRequestBodyError } from '../errors/ReadRequestBodyError.js'

/**
 * Gets request body from an http request.
 * @param {import('http').IncomingMessage} req The request object
 * @returns {Promise<string | ReadRequestBodyError>} Request body as a promise
 * @throws {never} returns errors as value
 */
export const getRequestBody = (req) => {
	return new Promise((resolve) => {
		let body = ''

		req.on('error', (err) => {
			resolve(new ReadRequestBodyError(err.message, { cause: err }))
		})
		req.on('data', (chunk) => {
			body += chunk.toString()
		})

		req.on('end', async () => {
			return resolve(body)
		})
	})
}
