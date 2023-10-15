import { decodeEventLog } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeEventLog, Error>}
 */
export const decodeEventLogEffect = wrapInEffect(decodeEventLog);