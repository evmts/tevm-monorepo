import { wrapInEffect } from '../../wrapInEffect.js'
import { signMessage } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signMessage, import("viem/accounts").SignMessageErrorType>}
 */
export const signMessageEffect = wrapInEffect(signMessage)
