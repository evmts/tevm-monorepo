import { InvalidRequestError } from '@tevm/errors'
import { z } from 'zod'
import { InvalidJsonError } from '../errors/InvalidJsonError.js'

const zJsonRpcRequest = z.object({
	jsonrpc: z.literal('2.0').optional(),
	id: z.union([z.string(), z.number(), z.null()]).optional(),
	method: z.string(),
	params: z.unknown().optional(),
})

const zBulkRequest = z.array(zJsonRpcRequest)

/**
 * Parses a request body into a JSON-RPC request object.
 * Returns error if any
 * @param {string} body
 * @throws {never} returns errors as values
 */
export const parseRequest = (body) => {
	/**
	 * @type {unknown}
	 */
	let raw
	try {
		raw = JSON.parse(body)
	} catch (e) {
		const err = /** @type {Error} */ (e)
		return new InvalidJsonError(err.message, { cause: err })
	}
	const parsedRequest = Array.isArray(raw) ? zBulkRequest.safeParse(raw) : zJsonRpcRequest.safeParse(raw)
	if (!parsedRequest.success) {
		return new InvalidRequestError(JSON.stringify(parsedRequest.error.format()))
	}
	return parsedRequest.data
}
