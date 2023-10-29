import { wrapInEffect } from '../../wrapInEffect.js'
import { getContractAddress } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getContractAddress, never>}
 */
export const getContractAddressEffect = wrapInEffect(getContractAddress)
