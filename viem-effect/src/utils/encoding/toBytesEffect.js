import { toBytes } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toBytes, import("viem/utils").ToBytesErrorType>}
 */
export const toBytesEffect = wrapInEffect(toBytes);