import { wrapInEffect } from '../wrapInEffect.js'
import { createWalletClient } from 'viem'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createWalletClient, import("viem").CreateWalletClientErrorType>}
 */
export const createWalletClientEffect = wrapInEffect(createWalletClient)
