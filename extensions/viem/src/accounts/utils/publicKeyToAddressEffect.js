import { wrapInEffect } from '../../wrapInEffect.js'
import { publicKeyToAddress } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof publicKeyToAddress, import("viem/accounts").PublicKeyToAddressErrorType>}
 */
export const publicKeyToAddressEffect = wrapInEffect(publicKeyToAddress)
