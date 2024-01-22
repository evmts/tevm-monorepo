import { wrapInEffect } from '../../wrapInEffect.js'
import { slice } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof slice, import("viem/utils").SliceErrorType>}
 */
export const sliceEffect = wrapInEffect(slice)
