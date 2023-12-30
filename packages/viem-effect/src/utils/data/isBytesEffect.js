import { wrapInEffect } from '../../wrapInEffect.js'
import { isBytes } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isBytes, import("viem/utils").IsBytesErrorType>}
 */
export const isBytesEffect = wrapInEffect(isBytes)
