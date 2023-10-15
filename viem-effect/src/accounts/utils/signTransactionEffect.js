import { signTransaction } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signTransaction, import("viem/accounts").SignTransactionErrorType>}
 */
export const signTransactionEffect = wrapInEffect(signTransaction);