import { getLogs } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getLogs, import("viem/actions").GetLogsErrorType>}
 */
export const getLogsEffect = wrapInEffect(getLogs);