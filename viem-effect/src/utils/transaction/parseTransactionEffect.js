import { parseTransaction } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseTransaction, Error>}
 */
export const parseTransactionEffect = wrapInEffect(parseTransaction);