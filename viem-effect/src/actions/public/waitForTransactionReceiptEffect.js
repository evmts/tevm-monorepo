import { waitForTransactionReceipt } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof waitForTransactionReceipt, import("viem/actions").WaitForTransactionReceiptErrorType>}
 */
export const waitForTransactionReceiptEffect = wrapInEffect(waitForTransactionReceipt);