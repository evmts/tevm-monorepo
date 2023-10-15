import { isHash } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isHash, import("viem/utils").IsHashErrorType>}
 */
export const isHashEffect = wrapInEffect(isHash);