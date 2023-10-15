import { getSerializedTransactionType } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getSerializedTransactionType, import("viem/utils").GetSerializedTransactionTypeErrorType>}
 */
export const getSerializedTransactionTypeEffect = wrapInEffect(getSerializedTransactionType);