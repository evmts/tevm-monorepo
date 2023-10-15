import { getTransactionReceipt } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransactionReceipt, import("viem/actions").GetTransactionReceiptErrorType>}
 */
export const getTransactionReceiptEffect = wrapInEffect(getTransactionReceipt);