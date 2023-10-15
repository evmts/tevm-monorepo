import { sendUnsignedTransaction } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof sendUnsignedTransaction, import("viem/actions").SendUnsignedTransactionErrorType>}
 */
export const sendUnsignedTransactionEffect = wrapInEffect(sendUnsignedTransaction);