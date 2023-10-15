import { getTxpoolContent } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTxpoolContent, import("viem/actions").GetTxpoolContentErrorType>}
 */
export const getTxpoolContentEffect = wrapInEffect(getTxpoolContent);