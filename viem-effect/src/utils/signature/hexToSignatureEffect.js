import { hexToSignature } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hexToSignature, Error>}
 */
export const hexToSignatureEffect = wrapInEffect(hexToSignature);