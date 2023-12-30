import { wrapInEffect } from '../../wrapInEffect.js'
import { webSocket } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof webSocket, never>}
 */
export const webSocketEffect = wrapInEffect(webSocket)
