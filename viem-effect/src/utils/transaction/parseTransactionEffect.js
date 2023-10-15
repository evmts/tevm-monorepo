import { parseTransaction } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseTransaction, import("viem/utils").ParseTransactionErrorType>}
 */
export const parseTransactionEffect = wrapInEffect(parseTransaction);