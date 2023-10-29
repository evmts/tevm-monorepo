import { wrapInEffect } from '../../wrapInEffect.js'
import { signTypedData } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signTypedData, import("viem/accounts").SignTypedDataErrorType>}
 */
export const signTypedDataEffect = wrapInEffect(signTypedData)
