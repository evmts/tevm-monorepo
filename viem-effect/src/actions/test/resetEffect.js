import { reset } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof reset, import("viem/actions").ResetErrorType>}
 */
export const resetEffect = wrapInEffect(reset);