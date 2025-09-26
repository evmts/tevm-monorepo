import { InvalidRequestError } from '@tevm/errors'
import { z, treeifyError } from 'zod'
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

	if (Array.isArray(raw)) {
		const parsedRequest = zBulkRequest.safeParse(raw)
		if (!parsedRequest.success) {
			return new InvalidRequestError(JSON.stringify(treeifyError(parsedRequest.error)))
		}
		return parsedRequest.data
	} else {
		const parsedRequest = zJsonRpcRequest.safeParse(raw)
		if (!parsedRequest.success) {
			return new InvalidRequestError(JSON.stringify(treeifyError(parsedRequest.error)))
		}
		return parsedRequest.data
	}
}
