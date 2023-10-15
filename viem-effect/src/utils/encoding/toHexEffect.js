import { toHex } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toHex, import("viem/utils").ToHexErrorType>}
 */
export const toHexEffect = wrapInEffect(toHex);