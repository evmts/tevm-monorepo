import { wrapInEffect } from '../wrapInEffect.js'
import { generatePrivateKey } from 'viem/accounts'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof generatePrivateKey, import("viem/accounts").GeneratePrivateKeyErrorType>}
 */
export const generatePrivateKeyEffect = wrapInEffect(generatePrivateKey)
