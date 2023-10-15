import { setBalance } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setBalance, import("viem/actions").SetBalanceErrorType>}
 */
export const setBalanceEffect = wrapInEffect(setBalance);