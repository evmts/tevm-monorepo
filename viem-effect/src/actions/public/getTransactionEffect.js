import { getTransaction } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransaction, import("viem/actions").GetTransactionErrorType>}
 */
export const getTransactionEffect = wrapInEffect(getTransaction);