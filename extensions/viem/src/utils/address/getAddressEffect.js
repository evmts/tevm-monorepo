import { wrapInEffect } from '../../wrapInEffect.js'
import { getAddress } from 'viem/utils'

/**
 * // I manually updated this
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAddress, Error>}
 */
export const getAddressEffect = wrapInEffect(getAddress)
