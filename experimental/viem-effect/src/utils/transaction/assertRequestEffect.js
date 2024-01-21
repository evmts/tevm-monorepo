import { wrapInEffect } from '../../wrapInEffect.js'
import { assertRequest } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof assertRequest, import("viem/utils").AssertRequestErrorType>}
 */
export const assertRequestEffect = wrapInEffect(assertRequest)
