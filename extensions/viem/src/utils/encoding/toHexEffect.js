import { wrapInEffect } from '../../wrapInEffect.js'
import { toHex } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toHex, import("viem/utils").ToHexErrorType>}
 */
export const toHexEffect = wrapInEffect(toHex)
