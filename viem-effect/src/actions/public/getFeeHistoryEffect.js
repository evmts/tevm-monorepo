import { getFeeHistory } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFeeHistory, import("viem/actions").GetFeeHistoryErrorType>}
 */
export const getFeeHistoryEffect = wrapInEffect(getFeeHistory);