import { createPendingTransactionFilter } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof createPendingTransactionFilter, import("viem/actions").CreatePendingTransactionFilterErrorType>}
 */
export const createPendingTransactionFilterEffect = wrapInEffect(createPendingTransactionFilter);