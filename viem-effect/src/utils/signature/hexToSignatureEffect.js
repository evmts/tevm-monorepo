import { hexToSignature } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hexToSignature, import("viem").HexToSignatureErrorType>}
 */
export const hexToSignatureEffect = wrapInEffect(hexToSignature);