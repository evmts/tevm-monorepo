import { sendTransaction } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof sendTransaction, import("viem/actions").SendTransactionErrorType>}
 */
export const sendTransactionEffect = wrapInEffect(sendTransaction);