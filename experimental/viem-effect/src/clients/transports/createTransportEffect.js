import { wrapInEffect } from '../../wrapInEffect.js'
import { createTransport } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof createTransport, import("viem").CreateTransportErrorType>}
 */
export const createTransportEffect = wrapInEffect(createTransport)
