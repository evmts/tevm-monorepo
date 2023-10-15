import { setIntervalMining } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setIntervalMining, import("viem/actions").SetIntervalMiningErrorType>}
 */
export const setIntervalMiningEffect = wrapInEffect(setIntervalMining);