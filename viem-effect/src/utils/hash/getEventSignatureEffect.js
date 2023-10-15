import { getEventSignature } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEventSignature, import("viem").GetEventSignatureErrorType>}
 */
export const getEventSignatureEffect = wrapInEffect(getEventSignature);