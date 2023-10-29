import { wrapInEffect } from '../wrapInEffect.js'
import { createPublicClient } from 'viem'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createPublicClient, import("viem").CreatePublicClientErrorType>}
 */
export const createPublicClientEffect = wrapInEffect(createPublicClient)
