import { wrapInEffect } from '../../wrapInEffect.js'
import { concat } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof concat, import("viem/utils").ConcatErrorType>}
 */
export const concatEffect = wrapInEffect(concat)
