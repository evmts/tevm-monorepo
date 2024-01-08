import { z } from 'zod'

/**
 * Zod validator for a valid JsonRpcRequest
 */
export const zJsonRpcRequest = z
	.object({
		jsonrpc: z.literal('2.0'),
		id: z.union([z.string(), z.number(), z.null()]).optional(),
		method: z.string(),
		// Could be strictor here
		// The actual type is any object any array of json serializable values
		params: z.union([z.record(z.any()), z.array(z.any())]).optional(),
	})
	.strict()
	.describe('A valid JsonRpcRequest')
