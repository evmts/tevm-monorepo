import { signMessage } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signMessage, import("viem/accounts").SignMessageErrorType>}
 */
export const signMessageEffect = wrapInEffect(signMessage);