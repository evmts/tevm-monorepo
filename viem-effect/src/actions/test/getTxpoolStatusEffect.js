import { getTxpoolStatus } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTxpoolStatus, import("viem/actions").GetTxpoolStatusErrorType>}
 */
export const getTxpoolStatusEffect = wrapInEffect(getTxpoolStatus);