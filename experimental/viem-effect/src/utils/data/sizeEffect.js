import { wrapInEffect } from '../../wrapInEffect.js'
import { size } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof size, import("viem/utils").SizeErrorType>}
 */
export const sizeEffect = wrapInEffect(size)
