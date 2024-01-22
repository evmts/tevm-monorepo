import { wrapInEffect } from '../../wrapInEffect.js'
import { trim } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof trim, import("viem/utils").TrimErrorType>}
 */
export const trimEffect = wrapInEffect(trim)
