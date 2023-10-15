import { getSerializedTransactionType } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getSerializedTransactionType, Error>}
 */
export const getSerializedTransactionTypeEffect = wrapInEffect(getSerializedTransactionType);