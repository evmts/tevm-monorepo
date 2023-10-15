import { getTransactionConfirmations } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransactionConfirmations, import("viem/actions").GetTransactionConfirmationsErrorType>}
 */
export const getTransactionConfirmationsEffect = wrapInEffect(getTransactionConfirmations);