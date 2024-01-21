import { wrapInEffect } from '../../wrapInEffect.js'
import { isAddressEqual } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isAddressEqual, import("viem/utils").IsAddressEqualErrorType>}
 */
export const isAddressEqualEffect = wrapInEffect(isAddressEqual)
