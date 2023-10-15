import { recoverPublicKey } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverPublicKey, import("viem/utils").RecoverPublicKeyErrorType>}
 */
export const recoverPublicKeyEffect = wrapInEffect(recoverPublicKey);