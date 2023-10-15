import { recoverPublicKey } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverPublicKey, Error>}
 */
export const recoverPublicKeyEffect = wrapInEffect(recoverPublicKey);