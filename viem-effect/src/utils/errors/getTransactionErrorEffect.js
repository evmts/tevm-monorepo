import { getTransactionError } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransactionError, Error>}
 */
export const getTransactionErrorEffect = wrapInEffect(getTransactionError);