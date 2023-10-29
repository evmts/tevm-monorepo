import { wrapInEffect } from '../../wrapInEffect.js'
import { toBytes } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toBytes, import("viem/utils").ToBytesErrorType>}
 */
export const toBytesEffect = wrapInEffect(toBytes)
