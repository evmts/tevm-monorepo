import { serializeTransaction } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof serializeTransaction, import("viem/utils").SerializeTransactionErrorType>}
 */
export const serializeTransactionEffect = wrapInEffect(serializeTransaction);