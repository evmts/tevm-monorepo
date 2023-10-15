import { decodeEventLog } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeEventLog, import("viem/contract").DecodeEventLogErrorType>}
 */
export const decodeEventLogEffect = wrapInEffect(decodeEventLog);