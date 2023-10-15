import { sendRawTransaction } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof sendRawTransaction, import("viem/actions").SendRawTransactionErrorType>}
 */
export const sendRawTransactionEffect = wrapInEffect(sendRawTransaction);