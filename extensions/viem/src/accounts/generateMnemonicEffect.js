import { wrapInEffect } from '../wrapInEffect.js'
import { generateMnemonic } from 'viem/accounts'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof generateMnemonic, import("viem/accounts").GenerateMnemonicErrorType>}
 */
export const generateMnemonicEffect = wrapInEffect(generateMnemonic)
