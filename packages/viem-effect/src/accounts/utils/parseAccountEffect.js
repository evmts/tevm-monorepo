import { wrapInEffect } from '../../wrapInEffect.js'
import { parseAccount } from 'viem/accounts'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseAccount, import("viem/accounts").ParseAccountErrorType>}
 */
export const parseAccountEffect = wrapInEffect(parseAccount)
