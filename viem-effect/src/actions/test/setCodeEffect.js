import { setCode } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setCode, import("viem/actions").SetCodeErrorType>}
 */
export const setCodeEffect = wrapInEffect(setCode);