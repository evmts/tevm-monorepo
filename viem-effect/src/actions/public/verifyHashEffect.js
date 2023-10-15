import { verifyHash } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof verifyHash, import("viem/actions").VerifyHashErrorType>}
 */
export const verifyHashEffect = wrapInEffect(verifyHash);