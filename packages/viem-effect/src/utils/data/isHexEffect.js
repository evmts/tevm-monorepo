import { wrapInEffect } from '../../wrapInEffect.js'
import { isHex } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isHex, import("viem/utils").IsHexErrorType>}
 */
export const isHexEffect = wrapInEffect(isHex)
