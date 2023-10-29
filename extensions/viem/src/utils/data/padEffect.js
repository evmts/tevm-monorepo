import { wrapInEffect } from '../../wrapInEffect.js'
import { pad } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof pad, import("viem/utils").PadErrorType>}
 */
export const padEffect = wrapInEffect(pad)
