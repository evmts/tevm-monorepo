import { fromHex } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fromHex, import("viem/utils").FromHexErrorType>}
 */
export const fromHexEffect = wrapInEffect(fromHex);