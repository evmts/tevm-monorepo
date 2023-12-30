import { wrapInEffect } from '../wrapInEffect.js'
import { mnemonicToAccount } from 'viem/accounts'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof mnemonicToAccount, import("viem/accounts").MnemonicToAccountErrorType>}
 */
export const mnemonicToAccountEffect = wrapInEffect(mnemonicToAccount)
