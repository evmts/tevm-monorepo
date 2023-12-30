import { wrapInEffect } from '../../wrapInEffect.js'
import { isHash } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isHash, import("viem/utils").IsHashErrorType>}
 */
export const isHashEffect = wrapInEffect(isHash)
