import { wrapInEffect } from '../../wrapInEffect.js'
import { fromBytes } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fromBytes, import("viem/utils").FromBytesErrorType>}
 */
export const fromBytesEffect = wrapInEffect(fromBytes)
