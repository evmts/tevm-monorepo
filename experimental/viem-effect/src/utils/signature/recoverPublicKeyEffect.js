import { wrapInEffect } from '../../wrapInEffect.js'
import { recoverPublicKey } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverPublicKey, import("viem/utils").RecoverPublicKeyErrorType>}
 */
export const recoverPublicKeyEffect = wrapInEffect(recoverPublicKey)
