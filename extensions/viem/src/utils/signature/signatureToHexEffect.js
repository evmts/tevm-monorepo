import { wrapInEffect } from '../../wrapInEffect.js'
import { signatureToHex } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signatureToHex, import("viem/accounts").SignatureToHexErrorType>}
 */
export const signatureToHexEffect = wrapInEffect(signatureToHex)
