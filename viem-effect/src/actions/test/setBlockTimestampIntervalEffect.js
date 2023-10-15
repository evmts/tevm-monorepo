import { setBlockTimestampInterval } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setBlockTimestampInterval, import("viem/actions").SetBlockTimestampIntervalErrorType>}
 */
export const setBlockTimestampIntervalEffect = wrapInEffect(setBlockTimestampInterval);