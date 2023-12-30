import { wrapInEffect } from '../../wrapInEffect.js'
import { isAddress } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isAddress, import("viem/utils").IsAddressErrorType>}
 */
export const isAddressEffect = wrapInEffect(isAddress)
