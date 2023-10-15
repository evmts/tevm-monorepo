import { revert } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof revert, import("viem/actions").RevertErrorType>}
 */
export const revertEffect = wrapInEffect(revert);