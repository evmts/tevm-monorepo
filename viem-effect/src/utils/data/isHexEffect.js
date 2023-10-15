import { isHex } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isHex, import("viem/utils").IsHexErrorType>}
 */
export const isHexEffect = wrapInEffect(isHex);