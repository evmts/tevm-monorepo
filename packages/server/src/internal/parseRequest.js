import { InvalidRequestError } from '@tevm/errors'
import { treeifyError, z } from 'zod'
import { InvalidJsonError } from '../errors/InvalidJsonError.js'

const zJsonRpcRequest = z.object({
	jsonrpc: z.literal('2.0').optional(),
	id: z.union([z.string(), z.number(), z.null()]).optional(),
	method: z.string(),
	params: z.unknown().optional(),
})

const zStrictJsonRpcRequest = z.object({
	jsonrpc: z.literal('2.0'),
	id: z.union([z.string(), z.number(), z.null()]).optional(),
	method: z.string(),
	params: z.unknown().optional(),
})

/**
 * @param {unknown} raw
 * @returns {string | number | null | undefined}
 */
const getJsonRpcId = (raw) => {
	if (typeof raw !== 'object' || raw === null || !('id' in raw)) {
		return undefined
	}
	const id = raw.id
	if (typeof id === 'string' || typeof id === 'number' || id === null) {
		return id
	}
	return undefined
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
const getJsonRpcMethod = (raw) => {
	if (typeof raw === 'object' && raw !== null && 'method' in raw && typeof raw.method === 'string') {
		return raw.method
	}
	return 'unknown'
}

/**
 * @param {unknown} raw
 * @param {InvalidRequestError} error
 */
const createInvalidBatchRequest = (raw, error) => ({
	__invalidJsonRpcRequest: true,
	...(getJsonRpcId(raw) !== undefined ? { id: getJsonRpcId(raw) } : { id: null }),
	method: getJsonRpcMethod(raw),
	jsonrpc: '2.0',
	error: {
		code: error.code,
		message: error.message,
	},
})

/**
 * Parses a request body into a JSON-RPC request object.
 * Returns error if any
 * @param {string} body
 * @throws {never} returns errors as values
 */
export const parseRequest = (body, options = {}) => {
	const { allowEmptyBatch = true, maxBatchSize = 100, requireJsonrpc = false } = options
	const requestSchema = requireJsonrpc ? zStrictJsonRpcRequest : zJsonRpcRequest
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
		if (!allowEmptyBatch && raw.length === 0) {
			return new InvalidRequestError('Empty batch requests are invalid')
		}
		if (raw.length > maxBatchSize) {
			return new InvalidRequestError(`Batch request exceeds configured max batch size of ${maxBatchSize}`)
		}
		return raw.map((request) => {
			const parsedRequest = requestSchema.safeParse(request)
			if (!parsedRequest.success) {
				return createInvalidBatchRequest(
					request,
					new InvalidRequestError(JSON.stringify(treeifyError(parsedRequest.error))),
				)
			}
			return parsedRequest.data
		})
	} else {
		const parsedRequest = requestSchema.safeParse(raw)
		if (!parsedRequest.success) {
			return new InvalidRequestError(JSON.stringify(treeifyError(parsedRequest.error)))
		}
		return parsedRequest.data
	}
}
