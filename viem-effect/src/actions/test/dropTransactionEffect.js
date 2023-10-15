import { dropTransaction } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof dropTransaction, import("viem/actions").DropTransactionErrorType>}
 */
export const dropTransactionEffect = wrapInEffect(dropTransaction);