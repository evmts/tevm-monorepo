import { fromBytes } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fromBytes, import("viem/utils").FromBytesErrorType>}
 */
export const fromBytesEffect = wrapInEffect(fromBytes);