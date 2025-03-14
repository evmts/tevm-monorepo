import { BaseError } from '@tevm/errors'
import type { CallResult } from '../Call/CallResult.js'

/**
 * Error thrown when a simulation call fails
 */
export class TevmSimulateCallError extends BaseError {
	/**
	 * @param {{ message?: string, cause?: Error }} [opts]
	 */
	constructor(opts: { message?: string; cause?: Error } = {}) {
		super(
			opts.message || 'Simulate call failed',
			{
				cause: opts.cause,
				metaMessages: [],
				details: '', // Use empty string instead of undefined
				docsPath: '', // Use empty string instead of undefined
			},
			'TevmSimulateCallError',
			-32000,
		)
	}
}

/**
 * Result of calling {@link simulateCallHandler}
 */
export type SimulateCallResult<ErrorType extends Error = TevmSimulateCallError> = CallResult<ErrorType> & {
	/**
	 * Block number used for simulation
	 */
	blockNumber: bigint
}
