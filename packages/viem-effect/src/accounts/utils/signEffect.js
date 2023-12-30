import { wrapInEffect } from '../../wrapInEffect.js'
import { sign } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof sign, import("viem/accounts").SignErrorType>}
 */
export const signEffect = wrapInEffect(sign)
