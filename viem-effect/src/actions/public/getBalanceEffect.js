import { getBalance } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getBalance, import("viem/actions").GetBalanceErrorType>}
 */
export const getBalanceEffect = wrapInEffect(getBalance);