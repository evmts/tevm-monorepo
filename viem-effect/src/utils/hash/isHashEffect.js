import { isHash } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isHash, Error>}
 */
export const isHashEffect = wrapInEffect(isHash);