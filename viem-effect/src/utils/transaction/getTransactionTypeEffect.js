import { getTransactionType } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransactionType, Error>}
 */
export const getTransactionTypeEffect = wrapInEffect(getTransactionType);