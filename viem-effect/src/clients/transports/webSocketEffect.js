import { webSocket } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof webSocket, Error>}
 */
export const webSocketEffect = wrapInEffect(webSocket);