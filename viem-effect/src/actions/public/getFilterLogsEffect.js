import { getFilterLogs } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFilterLogs, import("viem/actions").GetFilterLogsErrorType>}
 */
export const getFilterLogsEffect = wrapInEffect(getFilterLogs);