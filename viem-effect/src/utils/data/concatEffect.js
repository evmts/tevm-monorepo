import { concat } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof concat, import("viem/utils").ConcatErrorType>}
 */
export const concatEffect = wrapInEffect(concat);