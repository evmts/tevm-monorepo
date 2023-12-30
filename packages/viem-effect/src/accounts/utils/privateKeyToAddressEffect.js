import { wrapInEffect } from '../../wrapInEffect.js'
import { privateKeyToAddress } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof privateKeyToAddress, import("viem/accounts").PrivateKeyToAddressErrorType>}
 */
export const privateKeyToAddressEffect = wrapInEffect(privateKeyToAddress)
