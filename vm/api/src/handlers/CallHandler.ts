import type { CallParams, CallResult } from '../index.js'

export type CallHandler = (action: CallParams) => Promise<CallResult>
