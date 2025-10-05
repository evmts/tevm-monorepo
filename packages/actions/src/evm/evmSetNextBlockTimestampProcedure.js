import { InvalidParamsError } from '@tevm/errors'
import { hexToBigInt } from '@tevm/utils'

/**
 * Request handler for evm_setNextBlockTimestamp JSON-RPC requests.
 * Sets the timestamp for the next block to be mined.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EvmProcedure.js').EvmSetNextBlockTimestampProcedure}
 */
export const evmSetNextBlockTimestampProcedure = (client) => {
	return async (request) => {
		client.logger.debug({ request }, 'evm_setNextBlockTimestamp called')

		if (!Array.isArray(request.params) || request.params.length !== 1) {
			const error = new InvalidParamsError('Invalid params: Expected exactly one parameter (timestamp)')
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: error.code,
					message: error.message,
				},
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}

		const [timestampParam] = request.params

		try {
			const timestamp = typeof timestampParam === 'string' ? hexToBigInt(timestampParam) : BigInt(timestampParam)
			
			// Validate timestamp is not in the past or unreasonably far in the future
			const currentTime = BigInt(Math.floor(Date.now() / 1000))
			const maxFutureTime = currentTime + 86400n * 365n // 1 year in the future
			
			if (timestamp < 0n) {
				const error = new InvalidParamsError('Timestamp cannot be negative')
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: error.code,
						message: error.message,
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
			
			if (timestamp > maxFutureTime) {
				const error = new InvalidParamsError('Timestamp too far in the future')
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: error.code,
						message: error.message,
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}

			// Store the timestamp for the next block
			client.setNextBlockTimestamp(timestamp)

			client.logger.debug({ timestamp: timestamp.toString() }, 'Next block timestamp set')

			return {
				jsonrpc: '2.0',
				method: request.method,
				result: null,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (error) {
			const err = new InvalidParamsError(`Invalid timestamp parameter: ${error.message}`)
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: err.code,
					message: err.message,
				},
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	}
}