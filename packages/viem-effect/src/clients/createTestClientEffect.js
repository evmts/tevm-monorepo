import { wrapInEffect } from '../wrapInEffect.js'
import { createTestClient } from 'viem'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createTestClient, import("viem").CreateTestClientErrorType>}
 */
export const createTestClientEffect = wrapInEffect(createTestClient)
