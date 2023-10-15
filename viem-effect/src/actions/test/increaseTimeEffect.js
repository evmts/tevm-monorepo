import { increaseTime } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof increaseTime, import("viem/actions").IncreaseTimeErrorType>}
 */
export const increaseTimeEffect = wrapInEffect(increaseTime);