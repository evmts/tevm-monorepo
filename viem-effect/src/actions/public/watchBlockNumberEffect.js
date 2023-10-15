import { watchBlockNumber } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof watchBlockNumber, import("viem/actions").WatchBlockNumberErrorType>}
 */
export const watchBlockNumberEffect = wrapInEffect(watchBlockNumber);