import { getBlockTransactionCount } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getBlockTransactionCount, import("viem/actions").GetBlockTransactionCountErrorType>}
 */
export const getBlockTransactionCountEffect = wrapInEffect(getBlockTransactionCount);