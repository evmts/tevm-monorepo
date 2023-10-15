import { getFunctionSignature } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFunctionSignature, Error>}
 */
export const getFunctionSignatureEffect = wrapInEffect(getFunctionSignature);