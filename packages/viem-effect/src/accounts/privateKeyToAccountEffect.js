import { wrapInEffect } from '../wrapInEffect.js'
import { privateKeyToAccount } from 'viem/accounts'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof privateKeyToAccount, import("viem/accounts").PrivateKeyToAccountErrorType>}
 */
export const privateKeyToAccountEffect = wrapInEffect(privateKeyToAccount)
