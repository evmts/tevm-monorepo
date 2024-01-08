import type { CallParams, CallResult } from '../index.js'

/**
 * Handler for call tevm procedure
 */
export type CallHandler = (action: CallParams) => Promise<CallResult>
