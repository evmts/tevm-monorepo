import { toBytes } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toBytes, Error>}
 */
export const toBytesEffect = wrapInEffect(toBytes);