import { setNonce } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setNonce, import("viem/actions").SetNonceErrorType>}
 */
export const setNonceEffect = wrapInEffect(setNonce);