import { setNextBlockTimestamp } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setNextBlockTimestamp, import("viem/actions").SetNextBlockTimestampErrorType>}
 */
export const setNextBlockTimestampEffect = wrapInEffect(setNextBlockTimestamp);