import { prepareTransactionRequest } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof prepareTransactionRequest, import("viem/actions").PrepareTransactionRequestErrorType>}
 */
export const prepareTransactionRequestEffect = wrapInEffect(prepareTransactionRequest);