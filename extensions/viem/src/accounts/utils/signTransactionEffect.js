import { wrapInEffect } from '../../wrapInEffect.js'
import { signTransaction } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signTransaction, import("viem/accounts").SignTransactionErrorType>}
 */
export const signTransactionEffect = wrapInEffect(signTransaction)
