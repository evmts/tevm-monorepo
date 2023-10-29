import { wrapInEffect } from '../wrapInEffect.js'
import { createClient } from 'viem'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createClient, import("viem").CreateClientErrorType>}
 */
export const createClientEffect = wrapInEffect(createClient)
