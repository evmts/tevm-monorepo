import { createTransport } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof createTransport, import("viem").CreateTransportErrorType>}
 */
export const createTransportEffect = wrapInEffect(createTransport);