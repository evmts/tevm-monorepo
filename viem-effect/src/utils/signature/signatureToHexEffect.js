import { signatureToHex } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signatureToHex, Error>}
 */
export const signatureToHexEffect = wrapInEffect(signatureToHex);