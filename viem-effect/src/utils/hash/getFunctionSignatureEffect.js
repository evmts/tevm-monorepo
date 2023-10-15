import { getFunctionSignature } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFunctionSignature, import("viem").GetFunctionSignatureErrorType>}
 */
export const getFunctionSignatureEffect = wrapInEffect(getFunctionSignature);