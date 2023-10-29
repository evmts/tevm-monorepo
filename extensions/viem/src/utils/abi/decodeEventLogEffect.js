import { wrapInEffect } from '../../wrapInEffect.js'
import { decodeEventLog } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeEventLog, import("viem/contract").DecodeEventLogErrorType>}
 */
export const decodeEventLogEffect = wrapInEffect(decodeEventLog)
