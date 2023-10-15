import { signTransaction } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signTransaction, Error>}
 */
export const signTransactionEffect = wrapInEffect(signTransaction);