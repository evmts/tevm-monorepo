import { getEventSignature } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEventSignature, Error>}
 */
export const getEventSignatureEffect = wrapInEffect(getEventSignature);