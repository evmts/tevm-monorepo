import { wrapInEffect } from '../wrapInEffect.js'
import { hdKeyToAccount } from 'viem/accounts'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof hdKeyToAccount, never>}
 */
export const hdKeyToAccountEffect = wrapInEffect(hdKeyToAccount)
