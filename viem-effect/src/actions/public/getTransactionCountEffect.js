import { getTransactionCount } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransactionCount, import("viem/actions").GetTransactionCountErrorType>}
 */
export const getTransactionCountEffect = wrapInEffect(getTransactionCount);