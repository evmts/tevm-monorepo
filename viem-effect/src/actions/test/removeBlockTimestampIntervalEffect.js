import { removeBlockTimestampInterval } from "viem/test";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof removeBlockTimestampInterval, import("viem/test").RemoveBlockTimestampIntervalErrorType>}
 */
export const removeBlockTimestampIntervalEffect = wrapInEffect(removeBlockTimestampInterval);