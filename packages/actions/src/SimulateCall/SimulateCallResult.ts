import { BaseError } from '@tevm/errors'
import type { CallResult } from '../Call/CallResult.js'

/**
 * Error thrown when a simulation call fails
 */
export class TevmSimulateCallError extends BaseError {
  /**
   * @param {{ message?: string, cause?: Error }} [opts]
   */
  constructor(opts = {}) {
    super({
      shortMessage: opts.message || 'Simulate call failed',
      cause: opts.cause,
    })
  }
}

/**
 * Result of calling {@link simulateCallHandler}
 */
export type SimulateCallResult<
  ErrorType extends Error = TevmSimulateCallError,
> = CallResult<ErrorType> & {
  /**
   * Block number used for simulation
   */
  blockNumber: bigint
}