import { wrapInEffect } from '../wrapInEffect.js'
import { toAccount } from 'viem/accounts'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof toAccount, import("viem/accounts").ToAccountErrorType>}
 */
export const toAccountEffect = wrapInEffect(toAccount)
