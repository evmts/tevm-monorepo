import { serializeTransaction } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof serializeTransaction, Error>}
 */
export const serializeTransactionEffect = wrapInEffect(serializeTransaction);