import { watchPendingTransactions } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof watchPendingTransactions, import("viem/actions").WatchPendingTransactionsErrorType>}
 */
export const watchPendingTransactionsEffect = wrapInEffect(watchPendingTransactions);